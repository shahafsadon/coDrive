#include "RLEDecompressor.h"
#include <cctype>

/**
 * Appends 'symbol' to 'output' exactly 'count' times.
 */
void RLEDecompressor::appendRun(std::string& output, char symbol, int count) {
    if (count <= 0) return;

    output.reserve(output.size() + count);
    for (int i = 0; i < count; ++i) {
        output.push_back(symbol);
    }
}

/**
 * Decompresses RLE format: <char><count>
 *
 * We do NOT restrict characters — any character is allowed.
 * Only digits are treated as part of the count.
 */
std::string RLEDecompressor::decompress(const std::string& input) {
    std::string output;
    char currentChar = '\0';
    std::string number;

    for (char c : input) {
        if (std::isdigit(static_cast<unsigned char>(c))) {
            // The digit is part of the count
            number.push_back(c);
        } else {
            // New symbol encountered → write previous run
            if (currentChar != '\0' && !number.empty()) {
                int count = std::stoi(number);
                appendRun(output, currentChar, count);
            }

            currentChar = c;
            number.clear();
        }
    }

    // Write the last pending run
    if (currentChar != '\0' && !number.empty()) {
        int count = std::stoi(number);
        appendRun(output, currentChar, count);
    }

    return output;
}
