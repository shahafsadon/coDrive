#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include "ClientHandler.h"
#include <thread>

/**
 * @brief Entry point for the server application. 
 *        Sets up the server socket, listens for incoming connections,
 *        and spawns a new thread to handle each client.
 */
int main(int argc, char* argv[]) {

    // Basic argument validation — port must be provided
    if (argc < 2) {
        std::cerr << "[USAGE] server <port>" << std::endl;
        return 1;
    }
    int port = std::stoi(argv[1]);
    // Initialize FileManager and Application instances
    FileManager fm;
    Application app(fm);

    // Create server socket and create an IPv4 TCP socket (blocking by default)
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        perror("[SERVER ERROR] socket()");
        exit(EXIT_FAILURE);   // Creation failure is fatal
    }
    std::cout << "[SERVER] Socket created" << std::endl;

    // SCRUM-29: Bind socket to port
    sockaddr_in address{};
    address.sin_family = AF_INET;         // IPv4
    address.sin_addr.s_addr = INADDR_ANY; // Accept connections from any IP
    address.sin_port = htons(port);       // Convert to network byte order

    if (bind(server_fd, (sockaddr*)&address, sizeof(address)) < 0) {
        perror("[SERVER ERROR] bind()");
        close(server_fd);
        exit(EXIT_FAILURE);   // Cannot run without binding
    }
    std::cout << "[SERVER] Bound to port " << port << std::endl;

    // SCRUM-30: Start listening
    // SOMAXCONN lets OS manage the backlog limit
    if (listen(server_fd, SOMAXCONN) < 0) {
        perror("[SERVER ERROR] listen()");
        close(server_fd);
        exit(EXIT_FAILURE);
    }
    std::cout << "[SERVER] Listening..." << std::endl;

    // SCRUM-30 + SCRUM-31:
    // Accept incoming clients + basic internal error handling
    while (true) {
        sockaddr_in clientAddr{};
        socklen_t clientLen = sizeof(clientAddr);

        // SCRUM-33: Accept incoming client connections
        int client_socket = accept(server_fd, (sockaddr*)&clientAddr, &clientLen);

        if (client_socket < 0) {
            perror("[SERVER ERROR] accept()");
            continue;
        }
        std::cout << "[SERVER] Client connected" << std::endl;
        // Handle each client in a separate thread
        std::thread clientThread([client_socket, &app]() {
        handleClient(client_socket, app);
        });
        // Detach the thread to allow independent execution
        clientThread.detach();
    }   

    // Cleanup when program exits
    close(server_fd);
    return 0;
}
