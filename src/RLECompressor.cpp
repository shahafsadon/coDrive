#include "RLECompressor.h"
#include <cctype>

/**
 * ESCAPE-BASED RLE
 * - Normal printable characters are encoded as <char><count>.
 * - Digits and '\' must be escaped, because they would break decoding.
 * - Escaped characters are written as:  \x  (one escape per occurrence).
 */
std::string RLECompressor::compress(const std::string& input) {
    if (input.empty()) return "";  // No content: empty output

    std::string out;
    char curr = input[0];   // Current character in the run
    int count = 1;          // Length of the current run

    // Helper that writes the encoded form of character 'c' repeated 'n' times
    auto flushRun = [&](char c, int n) {
        // Safe to compress only if the character is not a digit and not '\'
        if (!std::isdigit((unsigned char)c) && c != '\\') {
            out += c;                   // Write the character
            out += std::to_string(n);   // Write how many times it appears
        } else {
            // Digits and '\' must be escaped one-by-one
            for (int i = 0; i < n; ++i) {
                out += '\\';            // Escape marker
                out += c;               // The literal character
            }
        }
    };

    // Iterate through input and detect repeating runs
    for (size_t i = 1; i < input.size(); ++i) {
        char c = input[i];

        if (c == curr) {
            count++;    // Same run continues
        } else {
            flushRun(curr, count);  // Write previous run
            curr = c;               // Start new run
            count = 1;
        }
    }

    flushRun(curr, count);  // Flush last run

    return out;             // Return encoded result
}
