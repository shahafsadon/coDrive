# coDrive

> Project Structure:
bash
.
├── src/                # Application Logic
│   ├── CommandParser.cpp   # Handles input parsing and dependency injection
│   ├── ConcreteCommands.h  # Implementation of commands logic (add, get, search,...)
│   ├── FileManager.cpp     # Handles all file I/O and environment variables
│   ├── ICommand.h          # Commands flexability (OCP) 
│   ├── main.cpp            # Application entry point & main loop
│   ├── RLECompressor.cpp   # Compressing txt
│   └── RLEDecompressor.cpp # Decompressing txt
├── tests/                # Unit Tests (gtest)
│   ├── CLIParserTest.cpp   # Tests for Parser's funcionallity
│   └── RLETest.cpp         # Tests for RLE engine's funcionallity
├── CMakeLists.txt        # Primary build configuration
├── Dockerfile            # Container definition
└── README.md             

How to Run (Using Docker):

> Step 1: Build the Image:

bash
docker build -t compressor-app .


> Step 2: Run the TestsTo verify all TDD stages are "Green":
bash
Bashdocker run compressor-app ./runTests

> Step 3: Run the ApplicationUse the -it flag for interactive input:
bash
Bashdocker run -it compressor-app
