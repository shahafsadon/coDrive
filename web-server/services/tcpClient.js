const net = require('net');

// Reusable TCP client for communicating with the C++ server
class TcpClient {
  constructor(options) {
    // Server connection details
    this.host = options.host;
    this.port = options.port;
    // Connection and response timing configuration
    this.connectTimeoutMs = options.connectTimeoutMs ?? 2000;
    this.responseIdleMs = options.responseIdleMs ?? 25;
    // Socket state
    this.socket = null;
    this.isConnected = false;
    // Request queue (only one request is handled at a time)
    this.queue = [];
    this.inFlight = null;
    // Incoming data handling
    this.recvBuffer = '';
    this.idleTimer = null;
  }

  // Send a command to the C++ server (queued, sequential execution)
  async send(command) {
    return new Promise((resolve, reject) => {
      this.queue.push({ command, resolve, reject });
      this._pumpQueue().catch(reject);
    });
  }

  // Close the TCP connection explicitly
  async close() {
    if (this.socket) {
      this.socket.end();
      this.socket.destroy();
    }
    this.socket = null;
    this.isConnected = false;
  }

  // Process the next command in the queue
  async _pumpQueue() {
    if (this.inFlight !== null) {
      // already handling a request
      return; 
    }
    const next = this.queue.shift();
    if (!next) {
      return;
    }
    this.inFlight = next;

    try {
      await this._ensureConnected();
      this._sendLine(next.command);
    } catch (err) {
      const { reject } = this.inFlight;
      this.inFlight = null;
      reject(err);
      this._pumpQueue().catch(() => {});
    }
  }

  // Ensure there is an active TCP connection
  async _ensureConnected() {
    if (this.isConnected && this.socket) {
      return;
    }

    await new Promise((resolve, reject) => {
      const sock = new net.Socket();
      this.socket = sock;
      this.isConnected = false;
      this.recvBuffer = '';

      // Disable Nagle for lower latency
      sock.setNoDelay(true);

      const onError = (err) => {
        cleanup();
        reject(err);
      };

      const onConnect = () => {
        cleanup();
        this.isConnected = true;
        this._attachDataHandlers();
        resolve();
      };

      const onTimeout = () => {
        cleanup();
        reject(new Error('TCP connect timeout'));
      };

      const cleanup = () => {
        sock.removeListener('error', onError);
        sock.removeListener('connect', onConnect);
        sock.removeListener('timeout', onTimeout);
      };

      sock.once('error', onError);
      sock.once('connect', onConnect);
      sock.once('timeout', onTimeout);
      sock.setTimeout(this.connectTimeoutMs);

      sock.connect(this.port, this.host);
    });
  }

  // Attach handlers for incoming data and connection lifecycle
  _attachDataHandlers() {
    if (!this.socket) {
      return;
    }

    this.socket.on('data', (chunk) => {
      const decoded = chunk.toString('utf8');
      this.recvBuffer += decoded;

      // Response ends shortly after newline (no length-based protocol)
      if (this.recvBuffer.includes('\n')) {
        this._armIdleTimer();
      }
    });

    this.socket.on('close', () => {
      this.isConnected = false;
      this.socket = null;

      // Fail the current request if connection closed unexpectedly
      if (this.inFlight) {
        const { reject } = this.inFlight;
        this.inFlight = null;
        reject(new Error('TCP connection closed'));
      }
    });

    this.socket.on('error', (err) => {
      // Error during active request
      if (this.inFlight) {
        const { reject } = this.inFlight;
        this.inFlight = null;
        reject(err);
      }
    });
  }

  // Arm a short idle timer to detect end of response
  _armIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      this.idleTimer = null;

      if (!this.inFlight) {
        this.recvBuffer = '';
        return;
      }

      const response = this.recvBuffer;
      this.recvBuffer = '';

      const { resolve } = this.inFlight;
      this.inFlight = null;
      resolve(response);

      this._pumpQueue().catch(() => {});
    }, this.responseIdleMs);
  }

  // Send a single line command (newline-terminated)
  _sendLine(line) {
    if (!this.socket || !this.isConnected) {
      throw new Error('TCP not connected');
    }
    // newline-terminated command
    const msg = `${line}\n`; 
    this.socket.write(msg);
  }
}

module.exports = TcpClient;
