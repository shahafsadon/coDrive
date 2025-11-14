#pragma once
#include <string>

// Just the basic interface for now.
// We'll fill in the real logic once the tests tell us what we need.
class RLECompressor {
public:
    std::string compress(const std::string& input);
};
