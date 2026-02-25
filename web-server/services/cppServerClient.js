// TCP client implementation (wrapper over net.Socket)
const TcpClient = require('./tcpClient');
// Docker-aware defaults
const host = process.env.CPP_SERVER_HOST || 'cpp-server';
// Port of the C++ server (default 8080)
const port = Number(process.env.CPP_SERVER_PORT || 8080);
// Single shared TCP client instance
const cppClient = new TcpClient({ host, port });

async function send(command) {
    try {
        const response = await cppClient.send(command);
        return response;
    } catch (err) {
        console.error('[CPP SERVER ERROR]', err.message);
        throw new Error('CPP_SERVER_UNAVAILABLE');
    }
}

module.exports = {
    send
};
