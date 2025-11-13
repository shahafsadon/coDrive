#pragma once //In order for the file to compile once and not each time its being included
#include <string>

// Each command will implement this interface
class ICommand {
public:
    virtual ~ICommand() = default;

    // execute() returns a string to be printed on the console.
    virtual std::string execute() = 0;
};