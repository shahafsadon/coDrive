#pragma once
#include <string>
#include "ICommand.h"

/**
 * @brief Execution: for invalid command
 */
class InvalidCommand : public ICommand {
private:
    std::string error_message_; // Saves error message

public:
    // Constructor to include error message
    InvalidCommand(const std::string& message) : error_message_(message) {}

    std::string execute() override {
        return "ERROR " + error_message_;
    }
};

/** 
 * @brief Concrete command for adding a new article.
 */ 
class AddArticleCommand : public ICommand {
private:
    std::string filename_;
    std::string text_;
public:
    AddArticleCommand(const std::string& filename, const std::string& text)
        : filename_(filename), text_(text) {}

    std::string execute() override {
        // ToDo: (RLE_Engine)

        return "";
    }
};

/** 
 * @brief Concrete command to get an article.
 */ 
class GetArticleCommand : public ICommand {
private:
    std::string filename_;
public:
    GetArticleCommand(const std::string& filename) : filename_(filename) {}

    std::string execute() override {
        // ToDo: (RLE_Engine)

        return "";
    }
};

/** 
 * @brief Concrete command to search an article.
 */ 
class SearchArticleCommand : public ICommand {
private:
    std::string content_;
public:
    SearchArticleCommand(const std::string& content) : content_(content) {}

    std::string execute() override {
        // ToDo: (RLE_Engine)

        return "";
    }
};