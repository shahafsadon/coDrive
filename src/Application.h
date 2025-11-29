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
    Application();                 // Default ctor for tests
    Application(FileManager& fm);  // ctor for server

    std::string process(const std::string& input);
};
