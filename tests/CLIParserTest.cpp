#include <gtest/gtest.h>
#include <memory>
#include <string>
#include "../src/CommandParser.h"
#include "../src/ConcreteCommands.h"
#include "../src/FileManager.h"

/**
 * @brief Test fixture providing a shared FileManager and CommandParser
 *        for all parser-related tests.
 */
class ParserTest : public ::testing::Test {
protected:
    FileManager fm;       // Dummy FileManager (not actually writing files here)
    CommandParser parser; // Parser under test

public:
    ParserTest() : fm(), parser(fm) {}
};

/**
 * @brief Ensures that a valid 'add' input produces AddArticleCommand.
 */
TEST_F(ParserTest, ShouldParseAddCommand) {
    std::string input = "add file1 someText123";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<AddArticleCommand*>(cmd.get()), nullptr);
}

/**
 * @brief Ensures that a valid 'get' input produces GetArticleCommand.
 */
TEST_F(ParserTest, ShouldParseGetCommand) {
    std::string input = "get file1";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<GetArticleCommand*>(cmd.get()), nullptr);
}

/**
 * @brief Ensures that a valid 'search' input produces SearchArticleCommand.
 */
TEST_F(ParserTest, ShouldParseSearchCommand) {
    std::string input = "search abc123";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<SearchArticleCommand*>(cmd.get()), nullptr);
}

/**
 * @brief Invalid command keyword should generate InvalidCommand.
 */
TEST_F(ParserTest, ShouldIgnoreInvalidCommand) {
    std::string input = "gibberish";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<InvalidCommand*>(cmd.get()), nullptr);

    // Invalid commands must return empty output
    EXPECT_EQ(cmd->execute(), "");
}

/**
 * @brief 'add' with no arguments must be treated as invalid.
 */
TEST_F(ParserTest, ShouldIgnoreIncompleteCommand_AddWithoutArgs) {
    std::string input = "add";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<InvalidCommand*>(cmd.get()), nullptr);
    EXPECT_EQ(cmd->execute(), "");
}

/**
 * @brief 'get' without filename must be treated as invalid.
 */
TEST_F(ParserTest, ShouldIgnoreIncompleteCommand_GetWithoutArgs) {
    std::string input = "get";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<InvalidCommand*>(cmd.get()), nullptr);
    EXPECT_EQ(cmd->execute(), "");
}

/**
 * @brief 'search' without content must be treated as invalid.
 */
TEST_F(ParserTest, ShouldIgnoreIncompleteCommand_SearchWithoutArgs) {
    std::string input = "search";
    auto cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
    EXPECT_NE(dynamic_cast<InvalidCommand*>(cmd.get()), nullptr);
    EXPECT_EQ(cmd->execute(), "");
}
