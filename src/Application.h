#pragma once
#include <string>
#include "CommandParser.h"
#include "FileManager.h"

class Application {
public:
    // ctor used by tests when providing FileManager externally
    Application(FileManager& fm);       
    // default ctor for production use
    Application(); 
    std::string process(const std::string& input);

private:
    // Reference to shared FileManager instance
    FileManager& fm_;  
    // Internal CommandParser instance for default ctor
    FileManager internalFm_;
    CommandParser parser_;
};
