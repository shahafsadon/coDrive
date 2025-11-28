#pragma once

#include <memory>
#include <string>
#include <sstream>

#include "ICommand.h"
#include "FileManager.h"

// Commands
#include "commands/AddArticleCommand.h"
#include "commands/GetArticleCommand.h"
#include "commands/SearchArticleCommand.h"
#include "commands/InvalidCommand.h"

class CommandParser {
private:
 FileManager& file_manager_;

public:
 explicit CommandParser(FileManager& fm);

 std::unique_ptr<ICommand> parse(const std::string& input);

private:
 std::unique_ptr<ICommand> tryParsePost(std::stringstream& ss);
 std::unique_ptr<ICommand> tryParseGet(std::stringstream& ss);
 std::unique_ptr<ICommand> tryParseDelete(std::stringstream& ss);
 std::unique_ptr<ICommand> tryParseSearch(std::stringstream& ss);
};
