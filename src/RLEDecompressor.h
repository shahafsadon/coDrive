#pragma once
#include <string>
#include <stdexcept>

/**
 * @brief Basic RLE decompressor that reverses the format produced
 *        by RLECompressor. Expected encoding is <char><count>.
 *
 * The decompressor:
 *  - Treats any non-digit as a literal symbol.
 *  - Accumulates consecutive digits into a full repeat count.
 *  - Supports all ASCII characters because only digit vs. non-digit matters.
 */
class RLEDecompressor {
public:
    std::string decompress(const std::string& input);   // Expands encoded text

private:
    /**
     * @brief Appends 'symbol' to the output exactly 'count' times.
     *        Helper used after parsing each encoded run.
     */
    void appendRun(std::string& output, char symbol, int count);
};
