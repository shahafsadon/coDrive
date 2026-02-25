#pragma once
#include "../ICommand.h"
#include <string>

class InvalidCommand : public ICommand {
public:
    InvalidCommand() = default;

    std::string execute(FileManager& fm) override;
};
