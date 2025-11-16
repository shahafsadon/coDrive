#include "FileManager.h"
#include <fstream>
#include <filesystem>
#include <sstream>
#include "RLEDecompressor.h"

namespace fs = std::filesystem;

/**
 * @brief Loads the base folder path from the environment variable
 *        ARTICLES_FOLDER. If the variable does not exist, no base
 *        path is used and file operations will fail gracefully.
 */
FileManager::FileManager() {
    char* env_path = std::getenv("ARTICLES_FOLDER");

    if (!env_path) {
        // No valid folder path provided
        base_path_ = "";
        return;
    }

    base_path_ = std::string(env_path);

    // Ensure the folder path ends with a slash
    if (!base_path_.empty() &&
        base_path_.back() != '/' &&
        base_path_.back() != '\\')
    {
        base_path_ += "/";
    }
}

/**
 * @brief Returns the full path of the requested filename
 *        inside the base folder.
 */
std::string FileManager::resolvePath(const std::string& filename) const {
    return (fs::path(base_path_) / filename).string();
}

/**
 * @brief Writes compressed data into a file using binary mode.
 */
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

/**
 * @brief Reads the full content of a compressed file.
 */
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

/**
 * @brief Searches for the given text inside all decompressed files
 *        located in the base folder.
 */
std::vector<std::string> FileManager::searchInFiles(const std::string& search_text) {
    std::vector<std::string> results;

    // Validate that the folder exists
    if (!fs::exists(base_path_) || !fs::is_directory(base_path_)) {
        return results;
    }

    for (const auto& entry : fs::directory_iterator(base_path_)) {
        if (!entry.is_regular_file()) continue;

        std::string filename = entry.path().filename().string();

        // Read the compressed content of the file
        auto compressed = readCompressed(filename);
        if (!compressed.has_value()) continue;

        RLEDecompressor dec;
        std::string decompressed;

        // Decompress the data safely
        try {
            decompressed = dec.decompress(compressed.value());
        }
        catch (...) {
            continue; // Skip corrupted files
        }

        // Search inside the decompressed text
        if (decompressed.find(search_text) != std::string::npos) {
            results.push_back(filename);
        }
    }

    return results;
}
