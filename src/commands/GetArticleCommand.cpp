#include "GetArticleCommand.h"
#include "../FileManager.h"
#include "../RLEDecompressor.h"

GetArticleCommand::GetArticleCommand(const std::string& name)
    : name_(name) {}

std::string GetArticleCommand::execute(FileManager& fm) {

    auto compressed = fm.readCompressed(name_);
    if (!compressed.has_value()) {
        return "404 Not Found\n";
    }

    RLEDecompressor dec;
    std::string content = dec.decompress(compressed.value());

    // EXACT required output format
    return "200 Ok\n\n" + content;
}
