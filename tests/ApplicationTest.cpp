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
 * @brief Test: Add a file and retrieve it (updated for HTTP-like responses).
 */
TEST(AppTest, AddAndGet) {
    setArticlesFolderAbs("test_articles");

    Application app;

    // POST returns: "201 Created\n"
    EXPECT_EQ(app.process("POST fileA hello123"), "201 Created\n");

    // GET returns:
    // "200 Ok\n\n<content>"
    std::string expected =
        "200 Ok\n"
        "\n"
        "hello123";

    EXPECT_EQ(app.process("GET fileA"), expected);

    std::filesystem::remove_all(std::filesystem::absolute("test_articles"));
}

/**
 * @brief Test: Verify support for numbers, symbols, and mixed ASCII.
 */
TEST(AppTest, AddAndGet_WithNumbersAndAscii) {
    setArticlesFolderAbs("test_articles2");

    Application app;

    std::string content = "heLLo 9912 !! %% @@ 123abcXYZ";

    EXPECT_EQ(app.process("POST asciiTest " + content), "201 Created\n");

    std::string expected =
        "200 Ok\n"
        "\n" +
        content;

    EXPECT_EQ(app.process("GET asciiTest"), expected);

    std::filesystem::remove_all(std::filesystem::absolute("test_articles2"));
}

/**
 * @brief Test: Search for a substring across multiple files.
 */
TEST(AppTest, SearchMultipleFiles) {
    setArticlesFolderAbs("test_articles3");

    Application app;

    app.process("POST f1 abcdef");
    app.process("POST f2 zzzabczzz");
    app.process("POST f3 none");

    std::string result = app.process("search abc");

    // SEARCH returns:
    // "200 Ok\n\nf1 f2"   (order not guaranteed, so only partial checks)
    EXPECT_NE(result.find("200 Ok\n"), std::string::npos);
    EXPECT_NE(result.find("f1"), std::string::npos);
    EXPECT_NE(result.find("f2"), std::string::npos);
    EXPECT_EQ(result.find("f3"), std::string::npos);

    std::filesystem::remove_all(std::filesystem::absolute("test_articles3"));
}

/**
 * @brief Test: Search should match exact content and ignore non-matching files.
 */
TEST(AppTest, SearchExactMatchAndNonMatch) {
    setArticlesFolderAbs("test_articles4");

    Application app;

    app.process("POST t1 hello world");
    app.process("POST t2 hi there");
    app.process("POST t3 well hello!!");

    std::string r1 = app.process("search hello");

    EXPECT_NE(r1.find("200 Ok\n"), std::string::npos);
    EXPECT_NE(r1.find("t1"), std::string::npos);  // must match
    EXPECT_NE(r1.find("t3"), std::string::npos);  // must match
    EXPECT_EQ(r1.find("t2"), std::string::npos);  // must NOT match

    std::filesystem::remove_all(std::filesystem::absolute("test_articles4"));
}
