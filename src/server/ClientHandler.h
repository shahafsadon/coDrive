#ifndef CLIENT_HANDLER_H
#define CLIENT_HANDLER_H

#include <unistd.h>
#include <string>

/**
 * @brief Handle communication with a single connected client.
 */
void handleClient(int clientSocket);

#endif // CLIENT_HANDLER_H
