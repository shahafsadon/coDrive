#include "AddArticleCommand.h"
#include "../FileManager.h"
#include "../RLECompressor.h"

AddArticleCommand::AddArticleCommand(const std::string& name,
                                     const std::string& content)
    : name_(name), content_(content) {}

std::string AddArticleCommand::execute(FileManager& fm) {

    RLECompressor comp;
    std::string compressed = comp.compress(content_);

    bool ok = fm.writeCompressed(name_, compressed);

    if (!ok) {
        return "400 Bad Request\n";
    }

    return "201 Created\n";
}
