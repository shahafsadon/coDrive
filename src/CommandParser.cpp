/** including sstream in order to test the strings
 * including CommandParser.h for undefined command
 * including ConcreteCommand to practice defined commands
 */
#include "CommandParser.h"
#include <string>
#include <memory>
#include <sstream>
#include "ConcreteCommands.h"

using namespace std;

/** @brief Analyzes undefined commands to defined commands
 * @param inputLine - Holds commands
 * @return Unique pointer to current command
 * or invalid command if not exists
 */
unique_ptr<ICommand> CommandParser::parse(const string& inputLine) {

    // To check each string in the command alone
    stringstream ss(inputLine);
    string command;

    ss >> command; // Reads first word

    // For SRP violation
    if (command == "add") {
        return tryParseAdd(ss, command);
    }
    
    if (command == "get") {
        return tryParseGet(ss, command);
    }
    
    if (command == "search") {
        return tryParseSearch(ss, command);
    }

    // REFACTOR: Pass a specific error message for unknown commands
    return make_unique<InvalidCommand>("Unknown command '" + command + "'.");
}

// ---Command Logic "add"---
unique_ptr<ICommand> CommandParser::tryParseAdd(stringstream& ss, const string& commandType) {
    string fileName;
    string text;

    ss >> fileName;
    getline(ss, text);

    if (!text.empty() && text[0] == ' ') {
        text = text.substr(1);
    }
    
    // Validation: command is invalid if arguments are missing
    if (fileName.empty() || text.empty()) {
        return make_unique<InvalidCommand>("'add' requires a filename and content."); 
    }
    
    return make_unique<AddArticleCommand>(fileName, text);
}

// ---Command Logic "get"---
unique_ptr<ICommand> CommandParser::tryParseGet(stringstream& ss, const string& commandType) {
    string fileName;

    ss >> fileName;
    
    // Validation: command is invalid if arguments are missing
    if (fileName.empty()) {
        return make_unique<InvalidCommand>("'get' required file."); 
    }

    // Check for extra arguments
    string extra;
    if (ss >> extra) {
        return make_unique<InvalidCommand>("'get' takes only one argument (filename).");
    }
    
    return make_unique<GetArticleCommand>(fileName);
}

// ---Command Logic "search"---
unique_ptr<ICommand> CommandParser::tryParseSearch(stringstream& ss, const string& commandType) {
    string content;
    getline(ss, content);

    if (!content.empty() && content[0] == ' ') {
        content = content.substr(1);
    }
    
    // Validation: command is invalid if arguments are missing
    if (content.empty()) {
        return make_unique<InvalidCommand>("'search' required content."); 
    }
    
    return make_unique<SearchArticleCommand>(content);
}


