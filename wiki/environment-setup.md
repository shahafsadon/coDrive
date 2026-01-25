← [Back to Wiki Home](./README.md)
# Environment Setup

This section describes the required tools and the general project structure
needed to run the coDrive system.

---

## Prerequisites

The following tools must be installed on the machine:

- **Docker**
- **Docker Compose**
- **Node.js**
- **Expo CLI / Expo Go** (for running the mobile client)

All backend services and the web client are executed using Docker.
The mobile client is executed separately using Expo.

---

## Project Structure

The project repository is organized into multiple layers that build upon each other:

- `cpp-server/`  
  C++ multi-threaded server responsible for low-level file system operations.

- `web-server/`  
  Node.js RESTful API server that handles authentication, authorization,
  business logic, and communication with the C++ server and MongoDB.

- `web-client/`  
  React-based web application that consumes the REST API and provides
  a Drive-like user interface.

- `mobile-client/`  
  React Native application that consumes the same REST API and provides
  equivalent core functionality on mobile devices.

- `docker-compose.yml`  
  Configuration file used to run all backend services and the web client together.

- `wiki/`  
  Project documentation, explanations, and screenshots.

---

## Notes

- All services communicate internally using Docker networking.
- The system does not rely on hard-coded data; all information is retrieved dynamically.
- No sensitive data (such as real passwords, tokens, or secrets) is stored in the repository.


Further details on running the system and demonstrating the implemented features
are provided in the following Wiki sections.
← [Back to Wiki Home](./README.md)
