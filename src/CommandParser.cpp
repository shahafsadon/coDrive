#include "CommandParser.h"
#include "commands/AddArticleCommand.h"
#include "commands/GetArticleCommand.h"
#include "commands/SearchArticleCommand.h"
#include "commands/InvalidCommand.h"
#include "commands/DeleteArticleCommand.h"
#include <sstream>

// Helper to trim whitespace
static std::string trim(const std::string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

CommandParser::CommandParser(FileManager& fm)
    : file_manager_(fm) {}


std::unique_ptr<ICommand> CommandParser::parse(const std::string& input) {

    std::stringstream ss(input);
    std::string keyword;
    ss >> keyword;

    if (keyword == "POST")
        return tryParsePost(ss);

    if (keyword == "GET")
        return tryParseGet(ss);

    if (keyword == "DELETE")
        return tryParseDelete(ss);

    if (keyword == "search")
        return tryParseSearch(ss);

    return std::make_unique<InvalidCommand>();
}

std::unique_ptr<ICommand> CommandParser::tryParsePost(std::stringstream& ss) {

    std::string fileName;
    ss >> fileName;
    fileName = trim(fileName);

    std::string text;
    std::getline(ss, text);

    // Remove leading space
    if (!text.empty() && text[0] == ' ')
        text.erase(0, 1);

    if (fileName.empty() || text.empty()) {
        return std::make_unique<InvalidCommand>();
    }

    return std::make_unique<AddArticleCommand>(fileName, text);
}


std::unique_ptr<ICommand> CommandParser::tryParseGet(std::stringstream& ss) {

    std::string fileName;
    ss >> fileName;
    fileName = trim(fileName);

    if (fileName.empty()) {
        return std::make_unique<InvalidCommand>();
    }

    return std::make_unique<GetArticleCommand>(fileName);
}

std::unique_ptr<ICommand> CommandParser::tryParseSearch(std::stringstream& ss) {

    std::string phrase;
    std::getline(ss, phrase);

    if (!phrase.empty() && phrase[0] == ' ')
        phrase.erase(0, 1);

    if (phrase.empty()) {
        return std::make_unique<InvalidCommand>();
    }

    return std::make_unique<SearchArticleCommand>(phrase);
}
std::unique_ptr<ICommand> CommandParser::tryParseDelete(std::stringstream& ss) {

    std::string fileName;
    ss >> fileName;
    fileName = trim(fileName);

    return std::make_unique<DeleteArticleCommand>(fileName);
}
