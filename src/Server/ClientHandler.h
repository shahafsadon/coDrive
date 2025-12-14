#ifndef CLIENT_HANDLER_H
#define CLIENT_HANDLER_H

#include <string>
#include "../Application.h"

/**
 * @brief Handle communication with a single connected client.
 * @param clientSocket The socket descriptor for the connected client.
 * @param app Reference to the shared Application instance.
 */
void handleClient(int clientSocket, Application& app);

#endif // CLIENT_HANDLER_H
