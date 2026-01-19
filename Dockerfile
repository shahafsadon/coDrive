FROM gcc:latest

# Install build tools
RUN apt-get update && apt-get install -y cmake

# Project directory
WORKDIR /usr/src/mytest

# Copy project files
COPY . .

# Articles folder (as required by EX2)
ENV ARTICLES_FOLDER=/articles/
RUN mkdir -p ${ARTICLES_FOLDER}

# Build folder
RUN mkdir -p build
WORKDIR /usr/src/mytest/build

# Build with CMake
RUN cmake .. && make

# Run the Server with default port 8080
ENTRYPOINT ["./Server"]
CMD ["8080"]
