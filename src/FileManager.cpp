#include "FileManager.h"
#include <fstream>
#include <filesystem>
#include <sstream>
#include "RLEDecompressor.h"

namespace fs = std::filesystem;

FileManager::FileManager() {}

std::string FileManager::getBasePath() const {
    const char* env = std::getenv("ARTICLES_FOLDER");
    if (!env) return "";
    std::string base = env;

    if (!base.empty() &&
        base.back() != '/' &&
        base.back() != '\\')
    {
        base += "/";
    }

    return base;
}

std::string FileManager::resolvePath(const std::string& filename) const {
    return (fs::path(getBasePath()) / filename).string();
}

bool FileManager::writeCompressed(const std::string& filename,
                                  const std::string& compressed_data)
{
    std::string full = resolvePath(filename);

    std::ofstream out(full, std::ios::binary);
    if (!out.is_open()) {
        return false;
    }

    out << compressed_data;
    return true;
}

std::optional<std::string> FileManager::readCompressed(const std::string& filename) {
    std::string full = resolvePath(filename);

    std::ifstream in(full, std::ios::binary);
    if (!in.is_open()) {
        return std::nullopt;
    }

    std::ostringstream buffer;
    buffer << in.rdbuf();
    return buffer.str();
}

std::vector<std::string> FileManager::searchInFiles(const std::string& search_text) {
    std::vector<std::string> results;

    std::string base = getBasePath();

    if (!fs::exists(base) || !fs::is_directory(base)) {
        return results;
    }

    for (const auto& entry : fs::directory_iterator(base)) {
        if (!entry.is_regular_file()) continue;

        std::string filename = entry.path().filename().string();

        auto compressed = readCompressed(filename);
        if (!compressed.has_value()) continue;

        RLEDecompressor dec;
        std::string decompressed;

        try {
            decompressed = dec.decompress(compressed.value());
        } catch (...) {
            continue;
        }

        if (decompressed.find(search_text) != std::string::npos) {
            results.push_back(filename);
        }
    }

    return results;
}
