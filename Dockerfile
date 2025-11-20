FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/src/mytest
COPY . .

ENV ARTICLES_FOLDER=/articles/

RUN mkdir -p ${ARTICLES_FOLDER}

RUN mkdir -p build
WORKDIR /usr/src/mytest/build

RUN cmake .. && make

CMD ["./coDriveApp"]