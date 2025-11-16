#pragma once
#include <string>
#include "ICommand.h"
#include "FileManager.h"
#include "RLECompressor.h"
#include "RLEDecompressor.h"

/**
 * @brief Command returned when the parser fails to identify a valid command.
 */
class InvalidCommand : public ICommand {
private:
    std::string error_message_;   // error text provided by the parser

public:
    explicit InvalidCommand(const std::string& message)
        : error_message_(message) {}

    std::string execute() override {
        // The assignment requires printing ERROR before the message.
        return "ERROR " + error_message_;
    }
};


/**
 * @brief Handles creation of a new article file.
 *        The content is compressed using RLE before being written.
 */
class AddArticleCommand : public ICommand {
private:
    std::string filename_;
    std::string text_;
    FileManager& file_manager_;

public:
    AddArticleCommand(const std::string& filename,
                      const std::string& text,
                      FileManager& fm)
        : filename_(filename), text_(text), file_manager_(fm) {}

    std::string execute() override {
        RLECompressor compressor;
        std::string compressed = compressor.compress(text_);

        // Write the compressed data to disk
        bool success = file_manager_.writeCompressed(filename_, compressed);
        if (!success) {
            return "ERROR failed to write file.";
        }

        // According to the task: success returns an empty line
        return "";
    }
};


/**
 * @brief Retrieves and decompresses the content of an article file.
 */
class GetArticleCommand : public ICommand {
private:
    std::string filename_;
    FileManager& file_manager_;

public:
    GetArticleCommand(const std::string& filename, FileManager& fm)
        : filename_(filename), file_manager_(fm) {}

    std::string execute() override {
        // Try reading compressed content
        auto compressed = file_manager_.readCompressed(filename_);
        if (!compressed.has_value()) {
            return "ERROR file not found.";
        }

        RLEDecompressor decompressor;
        try {
            return decompressor.decompress(compressed.value());
        }
        catch (...) {
            // Any malformed input or decoding issue
            return "ERROR invalid compressed data.";
        }
    }
};


/**
 * @brief Searches all article files for the given text.
 *        The search is done on the *decompressed* content.
 */
class SearchArticleCommand : public ICommand {
private:
    std::string content_;
    FileManager& file_manager_;

public:
    SearchArticleCommand(const std::string& content, FileManager& fm)
        : content_(content), file_manager_(fm) {}

    std::string execute() override {
        auto results = file_manager_.searchInFiles(content_);

        // Empty result → print an empty line as required
        if (results.empty()) {
            return "";
        }

        // Build newline-separated file list
        std::string output;
        for (const auto& name : results) {
            output += name + "\n";
        }

        // Remove trailing newline
        if (!output.empty()) {
            output.pop_back();
        }

        return output;
    }
};
