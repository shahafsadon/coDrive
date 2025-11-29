#include "ClientHandler.h"
#include <iostream>
#include <cstring>

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

#include "../FileManager.h"
#include "../CommandParser.h"



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

        if (bytes <= 0) {
            return ""; // client disconnected or error
        }

        for (int i = 0; i < bytes; i++) {
            command.push_back(buffer[i]);
            if (buffer[i] == '\n') {
                return command;
            }
        }
    }
}

/**
 *  @brief Handle communication with a single connected client.
 */
void handleClient(int clientSocket)
{
    std::cout << "[SERVER] Handling new client..." << std::endl;

    FileManager fm;
    CommandParser parser(fm);

    while (true) {

        // SCRUM-38: read one full command
        std::string cmdLine = readCommand(clientSocket);

        // SCRUM-39: client disconnected
        if (cmdLine.empty()) {
            std::cout << "[SERVER] Client disconnected." << std::endl;
            break;
        }

        // Parse and execute command
        auto cmd = parser.parse(cmdLine);
        std::string result = cmd->execute(fm);

        // Always end with newline when sending to client
        if (result.empty() || result.back() != '\n')
            result.push_back('\n');

        send(clientSocket, result.c_str(), result.size(), 0);
    }

    close(clientSocket);
}
