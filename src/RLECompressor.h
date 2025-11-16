#pragma once
#include <string>

/**
 * Simple Run-Length Encoding (RLE) compressor.
 * Goes over the input text and replaces each sequence
 * of identical characters with:   <char><count>
 *
 * Example:
 *     "aaabb"  →  "a3b2"
 */
class RLECompressor {
public:
    std::string compress(const std::string& input);
};
