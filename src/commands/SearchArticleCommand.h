#pragma once
#include <string>
#include "../ICommand.h"

class SearchArticleCommand : public ICommand {
private:
    std::string keyword_;

public:
    SearchArticleCommand(const std::string& keyword);

    std::string execute(FileManager& fm) override;
};
