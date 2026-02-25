#include "SearchArticleCommand.h"
#include "../FileManager.h"

SearchArticleCommand::SearchArticleCommand(const std::string& keyword)
    : keyword_(keyword) {}

std::string SearchArticleCommand::execute(FileManager& fm) {

    auto results = fm.searchInFiles(keyword_);

    // Output MUST ALWAYS start the same:
    std::string out = "200 Ok\n\n";

    // No matches: return only that
    if (results.empty())
        return out;

    // Otherwise add file names separated by a single space
    for (size_t i = 0; i < results.size(); ++i) {
        out += results[i];
        if (i + 1 < results.size())
            out += " ";  // space ONLY between items
    }

    return out;
}
