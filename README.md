# coDrive

## Project Structure

coDrive
.
├── src/                        # Application Logic
│   ├── CommandParser.cpp       # Handles input parsing and dependency injection
│   ├── ConcreteCommands.h      # Implementation of commands logic (add, get, search,…)
│   ├── FileManager.cpp         # Handles all file I/O and environment variables
│   ├── ICommand.h              # Commands flexibility (OCP)
│   ├── main.cpp                # Application entry point & main loop
│   ├── RLECompressor.cpp       # Compressing txt
│   └── RLEDecompressor.cpp     # Decompressing txt
│
├── tests/                      # Unit Tests (gtest)
│   ├── CLIParserTest.cpp       # Tests for Parser functionality
│   └── RLETest.cpp             # Tests for RLE engine functionality
│
├── CMakeLists.txt              # Primary build configuration
├── Dockerfile                  # Container definition
└── README.md

# How to Run (Using Docker)
Step 1: Build the Image

docker build -t compressor-app .

Step 2: Run the Tests

docker run compressor-app ./runTests

Step 3: Run the Application

docker run -it compressor-app


