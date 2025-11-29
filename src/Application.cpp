#include "Application.h"

// Default ctor for tests
Application::Application(FileManager& fm)
    : fm_(fm), parser_(fm_) {}

// Production ctor
Application::Application()
    : fm_(internalFm_), parser_(fm_) {}

std::string Application::process(const std::string& input) {
    auto cmd = parser_.parse(input);
    return cmd->execute(fm_);
}
