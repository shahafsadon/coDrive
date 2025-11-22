#include "CommandParser.h"
#include "ConcreteCommands.h"
#include <sstream>

/**
 * @brief Trims only filename (safe).
 *        We DO NOT trim text/content because it may contain
 *        numbers, spaces or any ASCII that must be preserved.
 */
static std::string trimFileName(const std::string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

CommandParser::CommandParser(FileManager& fm)
    : file_manager_(fm) {}   // Store reference to FileManager for command execution

/**
 * @brief Splits the input into the command name and parameters,
 *        then dispatches to the correct parsing function.
 */
std::unique_ptr<ICommand> CommandParser::parse(const std::string& inputLine) {

    std::stringstream ss(inputLine);  // Break input into tokens
    std::string command;
    ss >> command;                    // Extract command keyword (add/get/search)

    if (command == "add")    return tryParseAdd(ss);
    if (command == "get")    return tryParseGet(ss);
    if (command == "search") return tryParseSearch(ss);

    // Unknown command: (silent failure)
    return std::make_unique<InvalidCommand>();
}

/**
 * @brief Parses: add <filename> <text>
 *        Text may contain ANY ASCII characters.
 */
std::unique_ptr<ICommand> CommandParser::tryParseAdd(std::stringstream& ss) {
    std::string fileName;
    ss >> fileName;                   // Extract filename token
    fileName = trimFileName(fileName);

    std::string text;
    std::getline(ss, text);           // Read the rest as the content

    // Remove extra space caused by getline after operator>>
    if (!text.empty() && text[0] == ' ')
        text.erase(0, 1);

    // Validate both fields exist
    if (fileName.empty() || text.empty()) {
        return std::make_unique<InvalidCommand>();  // Silent invalid input
    }

    // Create command object
    return std::make_unique<AddArticleCommand>(fileName, text, file_manager_);
}

/**
 * @brief Parses: get <filename>
 */
std::unique_ptr<ICommand> CommandParser::tryParseGet(std::stringstream& ss) {
    std::string fileName;
    ss >> fileName;                   // Extract filename
    fileName = trimFileName(fileName);

    if (fileName.empty()) {
        return std::make_unique<InvalidCommand>();
    }

    return std::make_unique<GetArticleCommand>(fileName, file_manager_);
}

/**
 * @brief Parses: search <text>
 *        Everything after the keyword is treated as search content.
 */
std::unique_ptr<ICommand> CommandParser::tryParseSearch(std::stringstream& ss) {
    std::string content;
    std::getline(ss, content);        // Read full search phrase

    // Normalize leading space
    if (!content.empty() && content[0] == ' ')
        content.erase(0, 1);

    if (content.empty()) {
        return std::make_unique<InvalidCommand>();
    }

    return std::make_unique<SearchArticleCommand>(content, file_manager_);
}
