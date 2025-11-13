cmake_minimum_required(VERSION 3.14)
project(my_project)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_library(app_logic
    src/CommandParser.cpp
    src/CommandParser.h
    src/ConcreteCommands.h
    src/ICommand.h
)

add_executable(runTests tests/CLIParserTest.cpp)

target_link_libraries(runTests gtest gtest_main app_logic)