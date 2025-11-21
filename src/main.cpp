#include <iostream>
#include <string>
#include "Application.h"

int main() {
    Application app;              // Main application handler
    std::string inputLine;

    while (true)
    {
        // Read a full line of input from stdin
        if (!std::getline(std::cin, inputLine)) {
            clearerr(stdin);      // Reset stream state on EOF or input error
            continue;
        }

        if (inputLine.empty()) continue;  // Ignore empty commands

        // Process command and print its output (if any)
        std::cout << app.process(inputLine);
    }

    return 0;
}
