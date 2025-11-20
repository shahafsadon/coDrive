// Required libraries
// <memory> -> for the smart pointer "unique_ptr" deletes held memory
#include <gtest/gtest.h>
#include <string>
#include <memory> 
#include <stdexcept>

#include "../src/CommandParser.h"
#include "../src/ICommand.h"
#include "../src/ConcreteCommands.h"
#include "../src/FileManager.h" 

using namespace std;

// --- Test Fixture ---
class ParserTest : public ::testing::Test {
protected :
    FileManager fm; // Adds fileManager to run tests
    CommandParser parser;

public:
    ParserTest() // Builder for Injection
        : fm(), // Builds fileManager
          parser(fm) {} // Builds Parser and inject to
};

//---Tests---

// "RED" test now "GREEN"
TEST_F(ParserTest, ShouldParseAddCommand) {
    string input = "add file1.txt content";
    unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // Check that it's the correct command type
    AddArticleCommand* addCmd = dynamic_cast<AddArticleCommand*>(cmd.get());
    ASSERT_NE(addCmd, nullptr);
}

// "RED" test now "GREEN"
TEST_F(ParserTest, ShouldParseGetCommand) {
    string input = "get file1.txt ";
    unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // Check that it's the correct command type
    GetArticleCommand* getCmd = dynamic_cast<GetArticleCommand*>(cmd.get());
    ASSERT_NE(getCmd, nullptr);
}

// "RED" test now "GREEN"
TEST_F(ParserTest, ShouldParseSearchCommand) {
    string input = "search content";
    unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // Check that it's the correct command type
    SearchArticleCommand* searchCmd = dynamic_cast<SearchArticleCommand*>(cmd.get());
    ASSERT_NE(searchCmd, nullptr);
}

// "GREEN" test MODIFIED to stay "Green"
TEST_F(ParserTest, ShouldIgnoreInvalidCommand) {
    string input = "g";
    unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // That is specifically an InvalidCommand.
    InvalidCommand* invalidCmd = dynamic_cast<InvalidCommand*>(cmd.get());
    ASSERT_NE(invalidCmd, nullptr);

    // This will notify the user about the ERROR
    EXPECT_EQ(cmd->execute(), "ERROR Unknown command 'g'.");
}

// "GREEN" test MODIFIED to stay "Green"
TEST_F(ParserTest, ShouldIgnoreIncompleteCommand) {
    string input = "add";
    unique_ptr<ICommand> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);

    // That is specifically an InvalidCommand.
    InvalidCommand* invalidCmd = dynamic_cast<InvalidCommand*>(cmd.get());
    ASSERT_NE(invalidCmd, nullptr);

    // This will notify the user about the ERROR
    EXPECT_EQ(cmd->execute(), "ERROR 'add' requires a filename and content.");
}

// --- Main Function ---
// This runs all the tests.
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}