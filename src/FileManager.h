#pragma once
#include <string>
#include <optional>
#include <vector>

/**
 * @brief Handles all file operations for the program.
 *        Responsible for writing, reading, and searching in compressed files.
 */
class FileManager {
private:
    // Base folder where all article files are stored.
    // Loaded from the environment variable ARTICLES_FOLDER.
    std::string base_path_;

public:
    /**
     * @brief Constructs a FileManager and loads the base folder path.
     */
    FileManager();

    /**
     * @brief Builds a full filesystem path for a filename.
     */
    std::string resolvePath(const std::string& filename) const;

    /**
     * @brief Saves compressed text into a file.
     * @return true if the file was written successfully.
     */
    bool writeCompressed(const std::string& filename,
                         const std::string& compressed_data);

    /**
     * @brief Reads an entire compressed file into a string.
     * @return optional string, empty if file does not exist.
     */
    std::optional<std::string> readCompressed(const std::string& filename);

    /**
     * @brief Searches for text in all files inside the base folder.
     * @return vector of filenames where the search text appears.
     */
    std::vector<std::string> searchInFiles(const std::string& search_text);
};
