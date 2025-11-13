#pragma once
#include <string>
#include <memory>
#include "ICommand.h"

/** 
 * @brief commands parser which gets an undefined 
 * command and turn it to a specific command
 * @param private functions used for SRP violation
 */
class CommandParser {
public:
    std::unique_ptr<ICommand> parse(const std::string& inputLine);
private:
    // Helper to try parsing 'add'
    std::unique_ptr<ICommand> tryParseAdd(std::stringstream& ss, const std::string& commandType);
    
    // Helper to try parsing 'get'
    std::unique_ptr<ICommand> tryParseGet(std::stringstream& ss, const std::string& commandType);
    
    // Helper to try parsing 'search'
    std::unique_ptr<ICommand> tryParseSearch(std::stringstream& ss, const std::string& commandType);
};