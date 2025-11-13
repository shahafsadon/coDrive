#pragma once
#include <string>
#include <memory>
#include "ICommand.h"

/** CLI commands parser which gets an undefined 
 * command and turn it to a specific command
 */
class CommandParser {
public:
    std::unique_ptr<ICommand> parse(const std::string& inputLine);
};
