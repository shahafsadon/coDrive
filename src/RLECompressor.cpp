#include "RLECompressor.h"

// NOTE for coDrive:
// This is the minimal version of the RLE encoder.
// Just enough to make the tests green.
// We'll revisit this in the refactor step and clean up anything weird.

std::string RLECompressor::compress(const std::string& input) {

    // Edge case: empty input. Tests expect empty output.
    if (input.empty()) {
        return "";
    }

    std::string out;
    char current = input[0];   // track which char we're counting
    int count = 1;             // how many times it repeats

    // Scan through the string and count consecutive duplicates
    for (size_t i = 1; i < input.size(); ++i) {
        if (input[i] == current) {
            count++;    // same char: continue counting
        } else {
            // Different char: flush the previous block
            // NOTE: concatenating char + string is slightly ugly,
            // but ok for now (we'll polish it in refactor).
            out += current + std::to_string(count);

            current = input[i];   // start tracking the next char
            count = 1;
        }
    }

    // Flush the last block after loop ends
    out += current + std::to_string(count);

    return out;
}
