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
 FileManager& file_manager_;   // Shared FileManager used by all parsed commands

public:
 /**
  * @brief Constructor that injects the FileManager dependency.
  *        Parser stores the reference for future command creation.
  */
 explicit CommandParser(FileManager& fm);

 /**
  * @brief Parses a full line of user input and returns the
  *        appropriate command object based on the keyword.
  */
 std::unique_ptr<ICommand> parse(const std::string& input);

private:
 // Helper methods for parsing specific command formats
 std::unique_ptr<ICommand> tryParseAdd(std::stringstream& ss);     // Handles "add"
 std::unique_ptr<ICommand> tryParseGet(std::stringstream& ss);     // Handles "get"
 std::unique_ptr<ICommand> tryParseSearch(std::stringstream& ss);  // Handles "search"
};
