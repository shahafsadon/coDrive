// TCP client implementation (wrapper over net.Socket)
const TcpClient = require('./tcpClient');
// Host of the C++ server:
const host = process.env.CPP_SERVER_HOST || '127.0.0.1';
// Port read from environment, default is 8080 as defined in the C++ server
const port = Number(process.env.CPP_SERVER_PORT || 8080);
// Single shared TCP client instance (reused across all requests)
const cppClient = new TcpClient({ host, port });
// Export as singleton so the same connection can be reused
module.exports = cppClient;
