#include "RLECompressor.h"

/**
 * Compresses the given string using a basic RLE method.
 * We count how many times the same character repeats,
 * and store: <character><repeat_count>.
 */
std::string RLECompressor::compress(const std::string& input) {
    if (input.empty()) {
        return "";
    }

    std::string result;
    char current = input[0];
    int count = 1;

    for (size_t i = 1; i < input.size(); ++i) {
        if (input[i] == current) {
            // Same character continues
            count++;
        } else {
            // New character → store previous one
            result += current;
            result += std::to_string(count);

            current = input[i];
            count = 1;
        }
    }

    // Store last run
    result += current;
    result += std::to_string(count);

    return result;
}
