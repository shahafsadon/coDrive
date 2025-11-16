#pragma once
#include <string>
#include <stdexcept>

/**
 * Basic RLE decompressor that can reverse the exact format
 * produced by RLECompressor:
 *
 *     <char><count>
 *
 * Works with ANY character (letters, spaces, punctuation, etc.)
 * because we only distinguish between:
 *     - non-digit → a symbol
 *     - digit → part of the number
 */
class RLEDecompressor {
public:
    std::string decompress(const std::string& input);

private:
    // Helper to append a character 'count' times
    void appendRun(std::string& output, char symbol, int count);
};
