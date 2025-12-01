cmake_minimum_required(VERSION 3.14)
project(coDrive)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# GoogleTest via FetchContent
include(FetchContent)

FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/refs/heads/main.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Application Logic Library
add_library(app_logic
        src/Application.cpp
        src/CommandParser.cpp
        src/FileManager.cpp
        src/RLECompressor.cpp
        src/RLEDecompressor.cpp
        src/commands/AddArticleCommand.cpp
        src/commands/GetArticleCommand.cpp
        src/commands/SearchArticleCommand.cpp
        src/commands/DeleteArticleCommand.cpp
        src/commands/InvalidCommand.cpp
)

target_include_directories(app_logic PUBLIC
        src
        src/commands
)

# Unit Tests
add_executable(runTests
        tests/CLIParserTest.cpp
        tests/RLETest.cpp
        tests/ApplicationTest.cpp
)

# ADD SERVER EXECUTABLE HERE
add_executable(Server
    src/Server/Server.cpp
    src/Server/ClientHandler.cpp
)

add_executable(Client
    src/Client/mainClient.cpp
    src/Client/Client.cpp
)


# For threading 
target_link_libraries(Server PRIVATE app_logic pthread)

# Link GoogleTest and app_logic to the test executable
target_link_libraries(runTests
        gtest
        gtest_main
        app_logic
)

# Enable testing
enable_testing()
add_test(NAME AllTests COMMAND runTests)

# Main Application Executable
add_executable(coDriveApp
    src/main.cpp
)

target_link_libraries(coDriveApp
    app_logic
)
