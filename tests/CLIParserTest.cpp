// Required libraries
// <memory> -> for the smart pointer "unique_ptr" deletes held memory
#include <gtest/gtest.h>
#include <string>
#include <memory> // 
#include <stdexcept>

// ---SCRUM-29 Stubs---
// needed signatures for file compilation
struct Command {
    virtual ~Command() = default;
};

struct AddCommand : public Command {
};

struct GetCommand : public Command {
};

struct SearchCommand : public Command {
};

// Temporary scrub to assure "RED" tests
class Parser {
public :
    Parser() {}

    std::unique_ptr<Command> parse(const std::string& input) {
        return nullptr;
    }
};

// ---Test Fixture---
// Parser object for tests
class ParserTest : public ::testing::Test {
protected :
    Parser parser;
};

//---Tests---
// "RED" test
TEST_F(ParserTest, ShouldParseAddCommand) {
    std::string input = "add file1.txt content";
    std::unique_ptr<Command> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
}

// "RED" test
TEST_F(ParserTest, ShouldParseGetCommand) {
    std::string input = "get file1.txt ";
    std::unique_ptr<Command> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
}

// "RED" test
TEST_F(ParserTest, ShouldParseSearchCommand) {
    std::string input = "search content";
    std::unique_ptr<Command> cmd = parser.parse(input);

    ASSERT_NE(cmd, nullptr);
}

// "GREEN" test
TEST_F(ParserTest, ShouldIgnoreInvalidCommand) {
    std::string input = "g";
    std::unique_ptr<Command> cmd = parser.parse(input);

    EXPECT_EQ(cmd, nullptr);
}

// "GREEN" test
TEST_F(ParserTest, ShouldIgnoreIncompleteCommand) {
    std::string input = "add";
    std::unique_ptr<Command> cmd = parser.parse(input);

    EXPECT_EQ(cmd, nullptr);
}

// --- Main Function ---
// This runs all the tests.
int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}