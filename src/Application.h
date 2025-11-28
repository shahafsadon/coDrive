#pragma once
#include <string>
#include "CommandParser.h"
#include "FileManager.h"

/**
 * @brief Main application façade.
 */
class Application {
private:
    FileManager fm_;
    CommandParser parser_;

public:
    Application();
    std::string process(const std::string& input);
};
