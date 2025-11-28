#include "InvalidCommand.h"

std::string InvalidCommand::execute(FileManager&) {
    return "400 Bad Request\n";
}
