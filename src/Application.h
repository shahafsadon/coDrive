#pragma once
#include <string>
#include "CommandParser.h"
#include "FileManager.h"

class Application {
private:
    FileManager fm_;        // Manages file read/write and compression storage
    CommandParser parser_;  // Parses user input into executable commands

public:
    Application() : fm_(), parser_(fm_) {}  // Initialize FileManager and bind it to parser

    std::string process(const std::string& input) {
        auto cmd = parser_.parse(input);  // Convert raw input into a command object
        return cmd->execute();            // Execute the command and return its output
    }
};
