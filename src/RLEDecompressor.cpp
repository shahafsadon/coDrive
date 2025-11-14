#include "RLEDecompressor.h"

// NOTE:
// Same idea here, minimal decode logic.
// Reads something like "a3b2" and expands it to "aaabb".
// If we later need to handle weird input (multi-digit counts etc.),
// we’ll deal with it in refactor.

std::string RLEDecompressor::decompress(const std::string& input) {

    if (input.empty()) {
        return "";
    }

    std::string out;
    char currentChar = '\0';   // the letter we are currently decoding
    std::string number;        // the digits after the letter (.."12")

    for (char c : input) {
        if (std::isalpha(c)) {
            // If we already had a block waiting, flush it
            if (currentChar != '\0' && !number.empty()) {
                int count = std::stoi(number);
                out.append(count, currentChar);
            }

            // Start a new block
            currentChar = c;
            number.clear();
        }
        else {
            // Digit: add it to the number for this block
            number += c;
        }
    }

    // Flush the last block after loop ends
    if (currentChar != '\0' && !number.empty()) {
        int count = std::stoi(number);
        out.append(count, currentChar);
    }

    return out;
}
