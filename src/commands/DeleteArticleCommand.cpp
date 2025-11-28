#include "DeleteArticleCommand.h"
#include "../FileManager.h"

DeleteArticleCommand::DeleteArticleCommand(const std::string& name)
        : name_(name) {}

std::string DeleteArticleCommand::execute(FileManager& fm) {

    bool ok = fm.deleteFile(name_);

    if (!ok) {
        return "404 Not Found\n";
    }

    return "204 No Content\n";
}
