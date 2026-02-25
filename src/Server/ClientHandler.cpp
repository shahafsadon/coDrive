#include "ClientHandler.h"
#include <cstring>
#include <sys/socket.h>
#include <unistd.h>



/**
 *  @brief Read a command from the client socket until newline.
 *         Returns empty string on error or disconnection.
 */
static std::string readCommand(int clientSocket)
{
    std::string command;
    char buffer[1024];

    while (true) {
        int bytes = recv(clientSocket, buffer, sizeof(buffer), 0);
        // Handle disconnection or error
        if (bytes <= 0) {
            return ""; 
        }
        // Append received data to command
        for (int i = 0; i < bytes; i++) {
            command.push_back(buffer[i]);
            if (buffer[i] == '\n') {
                return command;
            }
        }
    }
}

/**
 *  @brief Handle client commands in a loop until disconnection.
 */
void handleClient(int clientSocket, Application& app)
{
    while (true) {
        // Read command from client
        std::string cmdLine = readCommand(clientSocket);
        // Break on disconnection or error
        if (cmdLine.empty())
            break;
        // Process command and get response
        std::string response = app.process(cmdLine);
        // Ensure response ends with newline
        if (response.empty() || response.back() != '\n')
            response.push_back('\n');
        // Send response back to client
        send(clientSocket, response.c_str(), response.size(), 0);
    }
    // Close client socket on exit
    close(clientSocket);
}
