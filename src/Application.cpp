#include "Application.h"

Application::Application()
    : fileManager_(), parser_(fileManager_) {}

Application::Application(FileManager& fm)
    : fileManager_(fm), parser_(fileManager_) {}

std::string Application::process(const std::string& input) {
    auto cmd = parser_.parse(input);
    return cmd->execute(fileManager_);
}
