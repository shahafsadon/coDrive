#pragma once
#include <string>
#include <stdexcept>

// RLEDecompressor handles decoding strings encoded by RLE.
// Example: "a3b2" to "aaabb".
class RLEDecompressor {
public:
    std::string decompress(const std::string& input);

private:
    // Helper: append "count" copies of character "ch" to output.
    void appendRun(std::string& output, char ch, int count) const;

    // Helper: checks if a char is a valid letter for RLE.
    bool isValidSymbol(char c) const;
};
