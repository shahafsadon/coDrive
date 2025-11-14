#pragma once
#include <string>

// RLECompressor is responsible only for encoding strings
// using a basic run-length encoding format (example: "aaabb" to "a3b2").
class RLECompressor {
public:
    std::string compress(const std::string& input);

private:
    // Helper: flush a single run into the output (example: 'a', 3 to "a3")
    std::string buildRunBlock(char ch, int count) const;
};
