#include <gtest/gtest.h>
#include "../src/Application.h"
#include <filesystem>
#include <cstdlib>

/**
 * @brief Helper function that assigns the ARTICLES_FOLDER
 *        environment variable to an absolute folder path.
 *        Ensures consistent behavior under Docker/CTest.
 */
static void setArticlesFolderAbs(const std::string& folderName) {
    std::filesystem::path folder = std::filesystem::absolute(folderName);
    std::filesystem::create_directory(folder);   // Create folder if missing

#ifdef _WIN32
    _putenv_s("ARTICLES_FOLDER", folder.string().c_str());
#else
    setenv("ARTICLES_FOLDER", folder.string().c_str(), 1);
#endif
}

/**
 * @brief Test: Add a file and retrieve it.
 *        Confirms compression + storage + decompression work together.
 */
TEST(AppTest, AddAndGet) {
    setArticlesFolderAbs("test_articles");

    Application app;

    EXPECT_EQ(app.process("add fileA hello123"), "");   // Add content

    std::string result = app.process("get fileA");      // Retrieve content
    EXPECT_EQ(result, "hello123");

    std::filesystem::remove_all(std::filesystem::absolute("test_articles"));
}

/**
 * @brief Test: Verify support for numbers, symbols, and mixed ASCII.
 */
TEST(AppTest, AddAndGet_WithNumbersAndAscii) {
    setArticlesFolderAbs("test_articles2");

    Application app;

    std::string content = "heLLo 9912 !! %% @@ 123abcXYZ";

    EXPECT_EQ(app.process("add asciiTest " + content), "");

    std::string result = app.process("get asciiTest");
    EXPECT_EQ(result, content);   // Must decompress exactly the same text

    std::filesystem::remove_all(std::filesystem::absolute("test_articles2"));
}

/**
 * @brief Test: Search for a substring across multiple files.
 */
TEST(AppTest, SearchMultipleFiles) {
    setArticlesFolderAbs("test_articles3");

    Application app;

    app.process("add f1 abcdef");
    app.process("add f2 zzzabczzz");
    app.process("add f3 none");

    std::string result = app.process("search abc");

    EXPECT_NE(result.find("f1"), std::string::npos);  // Should match
    EXPECT_NE(result.find("f2"), std::string::npos);  // Should match
    EXPECT_EQ(result.find("f3"), std::string::npos);  // Should NOT match

    std::filesystem::remove_all(std::filesystem::absolute("test_articles3"));
}

/**
 * @brief Test: Search should match exact content and ignore non-matching files.
 */
TEST(AppTest, SearchExactMatchAndNonMatch) {
    setArticlesFolderAbs("test_articles4");

    Application app;

    app.process("add t1 hello world");
    app.process("add t2 hi there");
    app.process("add t3 well hello!!");

    std::string r1 = app.process("search hello");

    EXPECT_NE(r1.find("t1"), std::string::npos);  // contains 'hello'
    EXPECT_NE(r1.find("t3"), std::string::npos);  // contains 'hello'
    EXPECT_EQ(r1.find("t2"), std::string::npos);  // does NOT contain 'hello'

    std::filesystem::remove_all(std::filesystem::absolute("test_articles4"));
}
