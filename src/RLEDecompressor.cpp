#include "RLEDecompressor.h"
#include <cctype>

/**
 * @brief Appends the character 'symbol' exactly 'count' times
 *        into the output string. Used after decoding each run.
 */
void RLEDecompressor::appendRun(std::string& output, char symbol, int count) {
    if (count <= 0) return;                      // Ignore non-positive counts
    output.reserve(output.size() + count);       // Optimize memory allocation
    for (int i = 0; i < count; ++i)
        output.push_back(symbol);                // Append repeated characters
}

/**
 * @brief Decodes RLE output supporting both:
 *        - Normal runs: <char><count>
 *        - Escaped literals: \x  (for digits and backslashes)
 *
 * The decoder:
 *  - Tracks current symbol.
 *  - Accumulates count digits.
 *  - Flushes correctly when switching symbols or encountering escape.
 */
std::string RLEDecompressor::decompress(const std::string& input) {
    std::string out;                             // Final decompressed output
    char symbol = '\0';                          // Current symbol being decoded
    std::string count;                           // Accumulated count digits

    for (size_t i = 0; i < input.size(); ++i) {
        char c = input[i];

        // ESCAPE MODE
        if (c == '\\') {

            // Flush any pending symbol before writing escaped literal
            if (symbol != '\0') {
                if (!count.empty())
                    appendRun(out, symbol, std::stoi(count)); // Repeat run
                else
                    out.push_back(symbol);                    // Single symbol
            }

            symbol = '\0';        // Reset state for escaped char
            count.clear();

            // Copy escaped literal directly
            if (i + 1 < input.size()) {
                out.push_back(input[i + 1]);    // Literal char after '\'
                i++;                            // Skip the escaped character
            }
            continue;
        }

        // Start of a new symbol
        if (symbol == '\0') {
            symbol = c;
            count.clear();
            continue;
        }

        // Digit: part of the count
        if (std::isdigit((unsigned char)c)) {
            count.push_back(c);
            continue;
        }

        // New non-digit symbol: flush previous symbol
        if (!count.empty()) {
            appendRun(out, symbol, std::stoi(count));   // Repeat previously decoded run
        } else {
            out.push_back(symbol);                      // Single occurrence
        }

        symbol = c;        // Start new run
        count.clear();
    }

    // Final flush after loop ends
    if (symbol != '\0') {
        if (!count.empty())
            appendRun(out, symbol, std::stoi(count));
        else
            out.push_back(symbol);
    }

    return out;    // Fully decompressed text
}
