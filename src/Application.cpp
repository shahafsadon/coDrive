#include "Application.h"

Application::Application()
    : fm_(), parser_(fm_) {}

std::string Application::process(const std::string& input) {
    auto cmd = parser_.parse(input);
    return cmd->execute(fm_);
}
