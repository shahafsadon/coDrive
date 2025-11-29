#pragma once
#include <string>
#include "CommandParser.h"
#include "FileManager.h"

/**
 * @brief Main application façade.
 */
class Application {
private:
    FileManager fileManager_;
    CommandParser parser_;

public:
    // Default ctor for tests
    Application();                 
    // ctor for server
    Application(FileManager& fm);  
    // Process a raw command string and return formatted output.
    std::string process(const std::string& input);
};
