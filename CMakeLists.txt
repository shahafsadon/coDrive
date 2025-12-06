cmake_minimum_required(VERSION 3.14)
project(coDrive)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# GoogleTest
include(FetchContent)

FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/refs/heads/main.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)


# app_logic LIBRARY
add_library(app_logic
        src/Application.cpp
        src/CommandParser.cpp
        src/FileManager.cpp
        src/RLECompressor.cpp
        src/RLEDecompressor.cpp

        # Commands
        src/commands/AddArticleCommand.cpp
        src/commands/DeleteArticleCommand.cpp
        src/commands/GetArticleCommand.cpp
        src/commands/SearchArticleCommand.cpp
        src/commands/InvalidCommand.cpp
)

target_include_directories(app_logic PUBLIC
        src
        src/commands
)


# SERVER EXECUTABLE
add_executable(Server
        src/server/server.cpp
        src/server/ClientHandler.cpp

        # These are needed because server.cpp uses Application / Parser / FM
        src/Application.cpp
        src/CommandParser.cpp
        src/FileManager.cpp
        src/RLECompressor.cpp
        src/RLEDecompressor.cpp

        # commands
        src/commands/AddArticleCommand.cpp
        src/commands/DeleteArticleCommand.cpp
        src/commands/GetArticleCommand.cpp
        src/commands/SearchArticleCommand.cpp
        src/commands/InvalidCommand.cpp
)

target_include_directories(Server PUBLIC
        src
        src/commands
        src/server
)

# Threading (Linux)
if(UNIX)
    target_link_libraries(Server PRIVATE pthread)
endif()


# CLIENT EXECUTABLE
add_executable(Client
        src/Client/Client.cpp
        src/Client/mainClient.cpp
)

target_include_directories(Client PUBLIC
        src
        src/Client
)

if(UNIX)
    target_link_libraries(Client PRIVATE pthread)
endif()


# UNIT TESTS
add_executable(runTests
        tests/ApplicationTest.cpp
        tests/CLIParserTest.cpp
        tests/RLETest.cpp
)

target_link_libraries(runTests
        gtest
        gtest_main
        app_logic
)

enable_testing()
add_test(NAME AllTests COMMAND runTests)


# LEGACY CLI BINARY (main.cpp)
add_executable(coDriveCLI
        src/main.cpp
)

target_link_libraries(coDriveCLI app_logic)
