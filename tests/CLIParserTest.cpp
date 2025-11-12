// Required libraries
// <memory> -> for the smart pointer "unique_ptr" deletes held memory
#include <gtest/gtest.h>
#include <string>
#include <memory> // 
#include <stdexcept>

#include "../src/CommandParser.h"
#include "../src/ICommand.h"
#include "../src/ConcreteCommands.h"

// ---Test Fixture---
class ParserTest : public ::testing::Test {
protected :
    CommandParser parser;
};

//---Tests---
// "RED" test now "GREEN"
TEST_F(ParserTest, ShouldParseAddCommand) {
    std::string input = "add file1.txt content";
    std::unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // Check that it's the correct command typee
    AddArticleCommand* addCmd = dynamic_cast<AddArticleCommand*>(cmd.get());
    ASSERT_NE(addCmd, nullptr);
}

// "RED" test now "GREEN"
TEST_F(ParserTest, ShouldParseGetCommand) {
    std::string input = "get file1.txt ";
    std::unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // Check that it's the correct command type
    GetArticleCommand* getCmd = dynamic_cast<GetArticleCommand*>(cmd.get());
    ASSERT_NE(getCmd, nullptr);
}

// "RED" test now "GREEN"
TEST_F(ParserTest, ShouldParseSearchCommand) {
    std::string input = "search content";
    std::unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // Check that it's the correct command type
    SearchArticleCommand* searchCmd = dynamic_cast<SearchArticleCommand*>(cmd.get());
    ASSERT_NE(searchCmd, nullptr);
}

// "GREEN" test MODIFIED to stay "Green"
TEST_F(ParserTest, ShouldIgnoreInvalidCommand) {
    std::string input = "g";
    std::unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // That is specifically an InvalidCommand.
    InvalidCommand* invalidCmd = dynamic_cast<InvalidCommand*>(cmd.get());
    ASSERT_NE(invalidCmd, nullptr);
}

// "GREEN" test MODIFIED to stay "Green"
TEST_F(ParserTest, ShouldIgnoreIncompleteCommand) {
    std::string input = "add";
    std::unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // That is specifically an InvalidCommand.
    InvalidCommand* invalidCmd = dynamic_cast<InvalidCommand*>(cmd.get());
    ASSERT_NE(invalidCmd, nullptr);
}

// --- Main Function ---
// This runs all the tests.
int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}