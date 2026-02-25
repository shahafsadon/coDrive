#pragma once
#include "../ICommand.h"
#include <string>

class GetArticleCommand : public ICommand {
private:
    std::string name_;

public:
    explicit GetArticleCommand(const std::string& name);
    std::string execute(FileManager& fm) override;
};
