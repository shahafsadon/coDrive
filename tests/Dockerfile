FROM gcc:latest

# Install cmake AND git
RUN apt-get update && apt-get install -y cmake git

# Set up the app directory
WORKDIR /usr/src/app
COPY . .

# Create the build directory
RUN mkdir build
WORKDIR /usr/src/app/build

# Run cmake (this will download gtest)
RUN cmake ..

# Run make (this will compile your code and tests)
RUN make

# Set the default command to run your tests
CMD ["./runTests"]