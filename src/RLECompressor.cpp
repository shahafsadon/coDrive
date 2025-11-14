#include "RLECompressor.h"

// Note for team:
// Refactored version is same behavior as Green phase,
// but logic is broken into smaller helpers and naming is clearer.

std::string RLECompressor::compress(const std::string& input) {

    // Basic sanity check, empty string stays empty.
    if (input.empty()) {
        return "";
    }

    std::string output;
    char currentChar = input[0];   // char we are currently counting
    int runLength = 1;             // number of consecutive chars

    // Iterate over the rest of the characters
    for (size_t i = 1; i < input.size(); ++i) {

        if (input[i] == currentChar) {
            // Same char, increase the run count
            runLength++;
        } else {
            // Different char, push previous block into output
            output += buildRunBlock(currentChar, runLength);

            // Start tracking the new character
            currentChar = input[i];
            runLength = 1;
        }
    }

    // Don't forget to flush the final block
    output += buildRunBlock(currentChar, runLength);

    return output;
}

// Helper function to build the encoded block
std::string RLECompressor::buildRunBlock(char ch, int count) const {
    // Using simple string operations, keeps things readable.
    return std::string(1, ch) + std::to_string(count);
}
