#pragma once
#include <string>

class Client {
private:
    int sock_;

public:
    Client();
    ~Client();

    void connectToServer(const std::string& ip, int port);
    void sendLine(const std::string& line);
    std::string receiveLine();
};
