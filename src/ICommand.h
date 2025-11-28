#pragma once
#include <string>

class FileManager;

/**
 * @brief Base interface for all commands.
 *        Each command executes using the shared FileManager.
 */
class ICommand {
public:
    virtual ~ICommand() = default;

    /**
     * @brief Execute the command using the provided FileManager.
     *        Returns a string to be printed.
     */
    virtual std::string execute(FileManager& fm) = 0;
};
