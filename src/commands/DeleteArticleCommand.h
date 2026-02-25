#pragma once
#include "../ICommand.h"
#include <string>

class DeleteArticleCommand : public ICommand {
private:
    std::string name_;

public:
    explicit DeleteArticleCommand(const std::string& name);

    std::string execute(FileManager& fm) override;
};
