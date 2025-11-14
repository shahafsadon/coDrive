#pragma once
#include <string>

// Same idea as the compressor – we start simple.
// Tests will guide the real implementation.
class RLEDecompressor {
public:
    std::string decompress(const std::string& input);
};
