#include <gtest/gtest.h>
#include <string>

#include "../src/RLECompressor.h"
#include "../src/RLEDecompressor.h"

// Basic test fixture for the RLE tests
class RLETest : public ::testing::Test {};


// Simple compression tests
TEST_F(RLETest, Compress_BasicString) {
    RLECompressor c;
    std::string input = "aaabb";
    std::string expected = "a3b2";

    ASSERT_EQ(c.compress(input), expected);
}


// Simple decompression tests
TEST_F(RLETest, Decompress_BasicString) {
    RLEDecompressor d;
    std::string input = "a3b2";
    std::string expected = "aaabb";

    ASSERT_EQ(d.decompress(input), expected);
}


// Edge case tests
TEST_F(RLETest, Compress_EmptyString) {
    RLECompressor c;
    ASSERT_EQ(c.compress(""), "");
}

TEST_F(RLETest, Compress_SingleChar) {
    RLECompressor c;
    ASSERT_EQ(c.compress("a"), "a1");
}

TEST_F(RLETest, Compress_MixedSequence) {
    RLECompressor c;
    ASSERT_EQ(c.compress("aabbcc"), "a2b2c2");
}
