#pragma once
#include <memory>
#include <string>
#include <sstream>
#include "ICommand.h"
#include "FileManager.h"

/**
 * @brief Converts raw user input into concrete command objects.
 *        Each command receives a reference to the shared FileManager.
 */
class CommandParser {
private:
 // Reference to the FileManager used across all commands
 FileManager& file_manager_;

public:
 /**
  * @brief Constructor that injects the FileManager dependency.
  */
 explicit CommandParser(FileManager& fm);

 /**
  * @brief Parses a full line of user input and returns
  *        the matching command implementation.
  */
 std::unique_ptr<ICommand> parse(const std::string& input);

private:
 std::unique_ptr<ICommand> tryParseAdd(std::stringstream& ss);
 std::unique_ptr<ICommand> tryParseGet(std::stringstream& ss);
 std::unique_ptr<ICommand> tryParseSearch(std::stringstream& ss);
};
