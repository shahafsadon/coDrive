#include "Client.h"
#include <stdexcept>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>


// Constructor initializes socket to invalid state
Client::Client() : sock_(-1) {}

// Destructor to close the socket if open
Client::~Client() {
    if (sock_ != -1) {
        close(sock_);
    }
}

// Connect to the Server at given IP and port
void Client::connectToServer(const std::string& ip, int port) {
    sock_ = socket(AF_INET, SOCK_STREAM, 0);
    if (sock_ < 0) {
        throw std::runtime_error("Failed to create socket");
    }

    // Setup Server address structure
    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);

    // Convert IP address from text to binary form
    if (inet_pton(AF_INET, ip.c_str(), &serverAddr.sin_addr) <= 0) {
        // Throw error if IP is invalid
        throw std::runtime_error("Invalid IP address");
    }

    // Connect to the Server
    if (connect(sock_, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        // Throw error if connection fails
        throw std::runtime_error("Failed to connect");
    }
}

// Send a line to the Server
void Client::sendLine(const std::string& line) {
    std::string msg = line + "\n"; // REQUIRED delimiter
    send(sock_, msg.c_str(), msg.size(), 0);
}

// Receive a line from the Server
std::string Client::receiveLine() {
    char buffer[4096];
    int len = recv(sock_, buffer, sizeof(buffer), 0);

    if (len <= 0) {
        // Connection closed or error
        throw std::runtime_error("Server disconnected");
    }

    return std::string(buffer, len);
}
