/** including sstream in order to test the strings
 * including CommandParser.h for undefined command
 * including ConcreteCommand to practice defined commands
 */
#include "CommandParser.h"
#include <string>
#include <memory>
#include <sstream>
#include "ConcreteCommands.h"

/** @brief Analyzes undefined commands to defined commands
 * @param inputLine - Holds commands
 * @return Unique pointer to current command
 * or invalid command if not exists
 */
std ::unique_ptr<ICommand> CommandParser::parse(const std::string& inputLine) {

    // To check each string in the command alone
    std::stringstream ss(inputLine);
    std::string command;

    ss >> command; // Reads first word

    // ---Command Logic "add"---
    if (command == "add") {
        std::string fileName;
        std::string text;

        ss >> fileName; // Reads second word

        std::getline(ss, text);// Reads the rest

        // Cleans ' ' from getline
        if (!text.empty() && text[0] == ' ') {
            text = text.substr(1);
        }
        
        // Validation: command is invalid if arguments are missing
        if (fileName.empty() || text.empty()) {
            return std::make_unique<InvalidCommand>(); 
        }
        
        return std::make_unique<AddArticleCommand>(fileName, text);
    }

    if (command == "get") {
        std::string fileName;
        ss >> fileName;// Reads second word
        
        // Validation: command is invalid if arguments are missing
        if (fileName.empty()) {
            return std::make_unique<InvalidCommand>(); 
        }

        // Validation: command is invalid if arguments are missing
        std::string extra;
        if (ss >> extra) {
            return std::make_unique<InvalidCommand>();
        }
        
        return std::make_unique<GetArticleCommand>(fileName);
    }

    if (command == "search") {
        std::string content;

        std::getline(ss, content);// Reads the rest

        // Cleans ' ' from getline
        if (!content.empty() && content[0] == ' ') {
            content = content.substr(1);
        }
        
        // Validation: command is invalid if arguments are missing
        if (content.empty()) {
            return std::make_unique<InvalidCommand>(); 
        }
        
        return std::make_unique<SearchArticleCommand>(content);
    }

    return std::make_unique<InvalidCommand>();// Validation: command is invalid if arguments are missing
}