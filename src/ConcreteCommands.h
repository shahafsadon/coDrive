#pragma once
#include <string>
#include "ICommand.h"
#include "FileManager.h"
#include "RLECompressor.h"
#include "RLEDecompressor.h"

/**
 * @brief Represents an invalid or incomplete command.
 *        Returns empty output as required by the assignment.
 */
class InvalidCommand : public ICommand {
public:
    InvalidCommand() {}

    std::string execute() override {
        return "";   // Silent behavior
    }
};


/**
 * @brief Handles writing a compressed article into storage.
 */
class AddArticleCommand : public ICommand {
private:
    std::string filename_;       // Target filename
    std::string text_;           // Raw text before compression
    FileManager& file_manager_;  // Shared file manager

public:
    AddArticleCommand(const std::string& filename,
                      const std::string& text,
                      FileManager& fm)
        : filename_(filename), text_(text), file_manager_(fm) {}

    std::string execute() override {
        RLECompressor compressor;
        std::string compressed = compressor.compress(text_);

        // Write compressed data; on failure return empty output
        bool success = file_manager_.writeCompressed(filename_, compressed);
        if (!success) {
            return "";   // Silent failure
        }

        return "";       // Success also returns empty
    }
};


/**
 * @brief Handles reading and decompressing an article.
 */
class GetArticleCommand : public ICommand {
private:
    std::string filename_;       // File to load
    FileManager& file_manager_;  // File system helper

public:
    GetArticleCommand(const std::string& filename, FileManager& fm)
        : filename_(filename), file_manager_(fm) {}

    std::string execute() override {
        // Attempt to read compressed bytes
        auto compressed = file_manager_.readCompressed(filename_);
        if (!compressed.has_value()) {
            return "";   // Silent if file missing
        }

        RLEDecompressor decompressor;

        try {
            return decompressor.decompress(compressed.value());  // Decompressed content
        }
        catch (...) {
            return "";   // Silent on corrupted data
        }
    }
};


/**
 * @brief Searches all saved articles for a specific substring.
 */
class SearchArticleCommand : public ICommand {
private:
    std::string content_;        // Search phrase
    FileManager& file_manager_;  // File iterator and reader

public:
    SearchArticleCommand(const std::string& content, FileManager& fm)
        : content_(content), file_manager_(fm) {}

    std::string execute() override {
        auto results = file_manager_.searchInFiles(content_);

        if (results.empty()) {
            return "";    // No matches: empty output
        }

        std::string output;
        for (const auto& name : results) {
         output += name + " "; // Append matching filenames
        }

        if (!output.empty()) {
            output.pop_back(); // remove trailing space
        }

        return output;
    }
};
