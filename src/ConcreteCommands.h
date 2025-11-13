#pragma once
#include <string>
#include "ICommand.h"

/**
 * @brief Execution: for invalid command
 */
class InvalidCommand : public ICommand {
public:
    void execute() override {
        // Nothing for now
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

    void execute() override {
        // ToDo:
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

    void execute() override {
        // ToDo:
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

    void execute() override {
        // ToDo:
    }
};