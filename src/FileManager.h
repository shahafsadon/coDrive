#pragma once
#include <string>
#include <optional>
#include <vector>

/**
 * @brief FileManager handles reading/writing of RLE-compressed article files.
 */
class FileManager {
public:
 FileManager();

 bool addArticle(const std::string& filename,
                 const std::string& text);

 std::optional<std::string> getArticle(const std::string& filename);
 std::vector<std::string> searchInFiles(const std::string& keyword);

 // MUST be public for commands
 bool writeCompressed(const std::string& filename,
                      const std::string& compressed_data);

 bool deleteFile(const std::string& filename);

 std::optional<std::string> readCompressed(const std::string& filename);

private:
 std::string getBasePath() const;
 std::string resolvePath(const std::string& filename) const;
};
