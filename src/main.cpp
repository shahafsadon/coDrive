#include <iostream>
#include <string>
#include "CommandParser.h"
#include "FileManager.h"

/**
 *  @brief This is the main entry point of the program.
 *  It creates a shared FileManager and a CommandParser,
 *  and then waits for user commands in a loop.
 */
int main()
{
    // The FileManager manages reading/writing compressed files
    FileManager fm;

    // The parser translates the user's text command into an ICommand object
    CommandParser parser(fm);

    std::string inputLine;

    while (true)
    {
        // Read a full line from standard input
        if (!std::getline(std::cin, inputLine)) {
            // If input fails (EOF), continue waiting
            clearerr(stdin);
            continue;
        }

        // Ignore completely empty lines
        if (inputLine.empty()) {
            continue;
        }

        // Parse and execute the command
        auto command = parser.parse(inputLine);
        std::string output = command->execute();

        /**
         * Important:
         * We print the output *without* an extra std::endl
         * because most commands already include a newline.
         * Adding another one caused the parser to receive an
         * empty command on the next loop.
         */
        std::cout << output;
    }

    return 0;
}
