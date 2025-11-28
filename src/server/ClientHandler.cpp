#include "ClientHandler.h"
#include <iostream>
#include <cstring>

/**
 *  @brief Handle communication with a single connected client.
 */
void handleClient(int clientSocket)
{
    std::cout << "[SERVER] Handling new client..." << std::endl;

    // Simple buffer for now — no protocol logic yet
    char buffer[1024];
    memset(buffer, 0, sizeof(buffer));

    // In SCRUM-34, we are *not* required to implement recv loop.
    // This is the skeleton the next SCRUM tasks will expand.

    // Close connection after the placeholder handler
    close(clientSocket);

    std::cout << "[SERVER] Client socket closed." << std::endl;
}
