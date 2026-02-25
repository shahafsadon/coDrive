#include <iostream>
#include <string>
#include "Client.h"

/**
 * @brief Main function for the client application.
 * takes care of connecting to the server and handling user input/output.
 */
int main(int argc, char** argv) {
    if (argc != 3) {
        std::cerr << "Usage: client <IP> <PORT>\n";
        return 1;
    }

    std::string ip = argv[1];
    int port = std::stoi(argv[2]);

    try {
        Client client;
        client.connectToServer(ip, port);

        while (true) {
            std::string line;
            if (!std::getline(std::cin, line)) {
                break; // EOF
            }

            client.sendLine(line);
            std::string reply = client.receiveLine();
            std::cout << reply;
        }
    }
    catch (const std::exception& ex) {
        std::cerr << ex.what() << "\n";
        return 1;
    }

    return 0;
}
