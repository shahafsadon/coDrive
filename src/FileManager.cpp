#include "FileManager.h"
#include <fstream>
#include <filesystem>
#include <sstream>

#include "RLECompressor.h"
#include "RLEDecompressor.h"

namespace fs = std::filesystem;

FileManager::FileManager() {}

/**
 * Gets base folder from env var ARTICLES_FOLDER.
 */
std::string FileManager::getBasePath() const {
    const char* env = std::getenv("ARTICLES_FOLDER");
    if (!env) return "";

    std::string base = env;

    if (!base.empty() && base.back() != '/' && base.back() != '\\')
        base += "/";

    return base;
}

/**
 * Safe join of base folder + filename.
 */
std::string FileManager::resolvePath(const std::string& filename) const {
    return (fs::path(getBasePath()) / filename).string();
}

/**
 * Writes compressed article to disk.
 */
bool FileManager::writeCompressed(const std::string& filename,
                                  const std::string& data)
{
    std::string full = resolvePath(filename);

    std::ofstream out(full, std::ios::binary);
    if (!out.is_open())
        return false;

    out << data;
    return true;
}

bool FileManager::deleteFile(const std::string& filename) {

    std::string full = resolvePath(filename);

    if (!std::filesystem::exists(full)) {
        return false;
    }

    return std::filesystem::remove(full);
}

/**
 * Reads compressed file from disk.
 */
std::optional<std::string> FileManager::readCompressed(const std::string& filename) {
    std::string full = resolvePath(filename);

    std::ifstream in(full, std::ios::binary);
    if (!in.is_open())
        return std::nullopt;

    std::ostringstream buffer;
    buffer << in.rdbuf();
    return buffer.str();
}

/**
 * PUBLIC: addArticle(name, text)
 */
bool FileManager::addArticle(const std::string& filename,
                             const std::string& text)
{
    RLECompressor comp;
    std::string compressed = comp.compress(text);

    return writeCompressed(filename, compressed);
}

/**
 * PUBLIC: getArticle(name)
 */
std::optional<std::string> FileManager::getArticle(const std::string& filename)
{
    auto compressed = readCompressed(filename);
    if (!compressed.has_value())
        return std::nullopt;

    RLEDecompressor dec;
    return dec.decompress(compressed.value());
}
/**
 * PUBLIC: searchInFiles(keyword)
 * Now supports:
 *   substring match in file CONTENT
 *   substring match in file NAME
 */
std::vector<std::string> FileManager::searchInFiles(const std::string& keyword)
{
    std::vector<std::string> results;

    std::string base = getBasePath();
    if (!fs::exists(base) || !fs::is_directory(base))
        return results;

    for (auto& entry : fs::directory_iterator(base))
    {
        if (!entry.is_regular_file())
            continue;

        std::string filename = entry.path().filename().string();

        // NEW REQUIREMENT: filename substring match
        bool nameMatch = (filename.find(keyword) != std::string::npos);

        //  Existing behavior: match inside file content
        auto compressed = readCompressed(filename);
        if (!compressed.has_value())
            continue;

        RLEDecompressor dec;
        std::string decompressed;

        try {
            decompressed = dec.decompress(compressed.value());
        }
        catch (...) {
            continue;   // skip corrupt files
        }

        bool contentMatch = (decompressed.find(keyword) != std::string::npos);

        //  Combined decision
        if (nameMatch || contentMatch)
            results.push_back(filename);
    }

    return results;
}
