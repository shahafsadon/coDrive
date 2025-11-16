#include "CommandParser.h"
#include "ConcreteCommands.h"

/**
 * @brief Helper function to remove leading and trailing whitespace.
 */
static std::string trim(const std::string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

CommandParser::CommandParser(FileManager& fm)
    : file_manager_(fm) {}

/**
 * @brief Splits the input into the command name and parameters,
 *        then dispatches to the correct parsing function.
 */
std::unique_ptr<ICommand> CommandParser::parse(const std::string& inputLine) {

    std::stringstream ss(inputLine);
    std::string command;
    ss >> command;

    if (command == "add")    return tryParseAdd(ss);
    if (command == "get")    return tryParseGet(ss);
    if (command == "search") return tryParseSearch(ss);

    return std::make_unique<InvalidCommand>("Unknown command '" + command + "'.");
}

/**
 * @brief Parses: add <filename> <text>
 */
std::unique_ptr<ICommand> CommandParser::tryParseAdd(std::stringstream& ss) {
    std::string fileName;
    ss >> fileName;
    fileName = trim(fileName);

    std::string text;
    std::getline(ss, text);
    text = trim(text);

    if (fileName.empty() || text.empty()) {
        return std::make_unique<InvalidCommand>(
            "'add' requires a filename and content.");
    }

    return std::make_unique<AddArticleCommand>(fileName, text, file_manager_);
}

/**
 * @brief Parses: get <filename>
 */
std::unique_ptr<ICommand> CommandParser::tryParseGet(std::stringstream& ss) {
    std::string fileName;
    ss >> fileName;
    fileName = trim(fileName);

    if (fileName.empty()) {
        return std::make_unique<InvalidCommand>(
            "'get' requires a filename.");
    }

    return std::make_unique<GetArticleCommand>(fileName, file_manager_);
}

/**
 * @brief Parses: search <text>
 */
std::unique_ptr<ICommand> CommandParser::tryParseSearch(std::stringstream& ss) {
    std::string content;
    std::getline(ss, content);
    content = trim(content);

    if (content.empty()) {
        return std::make_unique<InvalidCommand>(
            "'search' requires content to search.");
    }

    return std::make_unique<SearchArticleCommand>(content, file_manager_);
}
