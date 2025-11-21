#include <gtest/gtest.h>
#include <string>
#include "../src/RLECompressor.h"
#include "../src/RLEDecompressor.h"

/**
 * @brief Test fixture for RLE compressor/decompressor tests.
 *        (Empty because no shared setup is needed.)
 */
class RLETest : public ::testing::Test {};


// Basic Compression / Decompression

/**
 * @brief Verifies simple RLE compression and decompression.
 */
TEST_F(RLETest, CompressAndDecompress_Basic) {
    RLECompressor c;
    RLEDecompressor d;

    std::string input = "aaabb";
    std::string compressed = c.compress(input);

    EXPECT_EQ(compressed, "a3b2");            // Standard RLE form
    EXPECT_EQ(d.decompress(compressed), input);
}

/**
 * @brief Digits must be escaped in compression and restored correctly.
 */
TEST_F(RLETest, CompressAndDecompress_WithDigits) {
    RLECompressor c;
    RLEDecompressor d;

    std::string input = "abc123";
    std::string compressed = c.compress(input);

    // ESCAPED digits: \1 \2 \3
    EXPECT_EQ(compressed, "a1b1c1\\1\\2\\3");
    EXPECT_EQ(d.decompress(compressed), input);
}

/**
 * @brief ASCII punctuation symbols (non-digit, non-backslash)
 *        are compressible normally.
 */
TEST_F(RLETest, CompressAndDecompress_AsciiSymbols) {
    RLECompressor c;
    RLEDecompressor d;

    std::string input = "@@!!??++==";
    std::string compressed = c.compress(input);

    EXPECT_EQ(compressed, "@2!2?2+2=2");
    EXPECT_EQ(d.decompress(compressed), input);
}

/**
 * @brief Backslash must always be escaped and restored properly.
 */
TEST_F(RLETest, CompressAndDecompress_WithBackslash) {
    RLECompressor c;
    RLEDecompressor d;

    std::string input = "hello\\world";
    std::string compressed = c.compress(input);

    // `\\` represents an escaped backslash
    EXPECT_EQ(compressed, "h1e1l2o1\\\\w1o1r1l1d1");
    EXPECT_EQ(d.decompress(compressed), input);
}


// Edge Cases

/**
 * @brief Compression of empty string yields empty output.
 */
TEST_F(RLETest, Compress_EmptyString) {
    RLECompressor c;
    EXPECT_EQ(c.compress(""), "");
}

/**
 * @brief Decompression of empty string yields empty output.
 */
TEST_F(RLETest, Decompress_EmptyString) {
    RLEDecompressor d;
    EXPECT_EQ(d.decompress(""), "");
}

/**
 * @brief Single-character input must compress to <char>1.
 */
TEST_F(RLETest, Compress_SingleChar) {
    RLECompressor c;
    std::string input = "a";
    EXPECT_EQ(c.compress(input), "a1");

    RLEDecompressor d;
    EXPECT_EQ(d.decompress("a1"), input);
}

/**
 * @brief Verifies that mixed ASCII patterns survive a round-trip
 *        compression/decompression without data loss.
 */
TEST_F(RLETest, Compress_MixedLettersAndDigits) {
    RLECompressor c;
    RLEDecompressor d;

    std::string input = "heLLo 9912 !! %% @@ 123abcXYZ";
    std::string compressed = c.compress(input);

    EXPECT_EQ(d.decompress(compressed), input);   // Ensure exact recovery
}

/**
 * @brief Large run lengths must be handled correctly.
 */
TEST_F(RLETest, Stress_LongRepeatedChar) {
    RLECompressor c;
    RLEDecompressor d;

    std::string input(300, 'x');     // 300 repeated 'x'
    std::string compressed = c.compress(input);

    EXPECT_EQ(compressed, "x300");   // Large count must remain intact
    EXPECT_EQ(d.decompress(compressed), input);
}
