#pragma once
#include <string>
#include "../ICommand.h"

class AddArticleCommand : public ICommand {
private:
    std::string name_;
    std::string content_;

public:
    AddArticleCommand(const std::string& name,
                      const std::string& content);

    std::string execute(FileManager& fm) override;
};
