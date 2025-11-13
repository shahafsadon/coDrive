#pragma once //In order for the file to compile once and not each time its being included
#include <string>

// Each command will implement this interface
class ICommand {
public:
    virtual ~ICommand() = default;
    virtual void execute() = 0;
};