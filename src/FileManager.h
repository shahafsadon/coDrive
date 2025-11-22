#pragma once
#include <string>
#include <optional>
#include <vector>

/**
 * @brief Manages reading and writing of compressed article files.
 *        All file operations use a base folder defined by the environment.
 */
class FileManager {
public:
    FileManager();
    // Loads base folder path from environment (ARTICLES_FOLDER)

    /**
     * @brief Writes compressed data into a file.
     *        Returns true on success, false on I/O failure.
     */
    bool writeCompressed(const std::string& filename,
                         const std::string& compressed_data);

    /**
     * @brief Reads the raw compressed content of a file.
     *        Returns std::if the file cannot be opened.
     */
    std::optional<std::string> readCompressed(const std::string& filename);

    /**
     * @brief Searches all stored files for occurrences of search_text.
     *        Search is performed on decompressed content.
     */
    std::vector<std::string> searchInFiles(const std::string& search_text);

private:
    std::string getBasePath() const;            // Returns base folder used for storage
    std::string resolvePath(const std::string& filename) const;  // Builds full path
};
