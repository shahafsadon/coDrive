#include "RLEDecompressor.h"

// Note for team:
// This is a refactored version of the Green decode logic.
// Same behavior, but split into smaller helpers and with basic
// validation for malformed input.

std::string RLEDecompressor::decompress(const std::string& input) {

    if (input.empty()) {
        return "";
    }

    std::string output;
    char currentChar = '\0';       // symbol we're currently decoding
    std::string number;            // the digits after the symbol

    for (char c : input) {

        if (std::isalpha(c)) {
            // Flush previous block before starting a new one
            if (currentChar != '\0' && !number.empty()) {
                int count = std::stoi(number);
                appendRun(output, currentChar, count);
            }

            // Start a new run
            currentChar = c;
            number.clear();
        }
        else if (std::isdigit(c)) {
            number.push_back(c);
        }
        else {
            // Basic guard against weird inputs, just preventing silent failures.
            throw std::runtime_error("Invalid character in RLE input.");
        }
    }

    // Flush final block
    if (currentChar != '\0' && !number.empty()) {
        int count = std::stoi(number);
        appendRun(output, currentChar, count);
    }

    return output;
}

// Adds count copies of "ch" to the output.
// Team note: keeping this small and simple.
void RLEDecompressor::appendRun(std::string& output, char ch, int count) const {
    output.append(count, ch);
}

// For future extension (symbols allowed in RLE)
// Currently unused, but left for clarity/symmetry.
bool RLEDecompressor::isValidSymbol(char c) const {
    return std::isalpha(c);
}
