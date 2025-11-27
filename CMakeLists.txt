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

# Prevent override of parent compiler flags
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(googletest)


# App Logic Library
add_library(app_logic
        src/CommandParser.cpp
        src/RLECompressor.cpp
        src/RLEDecompressor.cpp
        src/FileManager.cpp
)


# Tests target
add_executable(runTests
        tests/CLIParserTest.cpp
        tests/RLETest.cpp
        tests/ApplicationTest.cpp
)

# ADD SERVER EXECUTABLE HERE
add_executable(server
    src/server/server.cpp
    src/server/ClientHandler.cpp
)


# For threading (SCRUM-32)
find_package(Threads REQUIRED)
target_link_libraries(server Threads::Threads)


target_link_libraries(runTests
        gtest
        gtest_main
        app_logic
)

# MAIN APPLICATION EXECUTABLE
add_executable(coDriveApp
        src/main.cpp
)

target_link_libraries(coDriveApp
        app_logic
)

enable_testing()
add_test(NAME AllTests COMMAND runTests)
