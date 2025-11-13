FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/src/mytest

WORKDIR /usr/src/mytest

RUN mkdir build
WORKDIR /usr/src/mytest/build

RUN cmake .. && make

# Run tests
CMD ["./runTests"]