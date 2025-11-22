#pragma once
#include <string>

/**
 * @brief Simple Run-Length Encoding (RLE) compressor.
 *        Encodes repeated characters as <char><count>.
 *        Does not handle escaping; actual logic is in the .cpp file.
 *
 * Example:
 *     "aaabb" to "a3b2"
 */
class RLECompressor {
public:
    std::string compress(const std::string& input);   // Encodes input using RLE
};
