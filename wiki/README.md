# coDrive – Project Wiki
← For a general overview of the project architecture, see the main README.md

This wiki documents the setup, execution, and core flows of the **coDrive** system.

The project simulates a Google Drive–like application and is developed incrementally
across multiple assignments.  
This wiki focuses on the **final integrated system**, combining backend services,
a web client, and a mobile client.

The documentation demonstrates how to run the full system and showcases the main
functional flows as required in Assignment 5.

---

## System Overview

The system is composed of several layers that work together:

- **C++ Server**  
  A multi-threaded backend server responsible for low-level file system operations.

- **Node.js Web Server**  
  A RESTful API server that handles authentication, authorization, business logic,
  and communication with both the C++ server and the database.

- **MongoDB**  
  Persistent storage for users, files, folders, permissions, and metadata.

- **Web Client (React)**  
  A browser-based user interface that provides full Drive-like functionality.

- **Mobile Client (React Native)**  
  A native mobile application that consumes the same REST API as the web client
  and provides equivalent core functionality.

All backend services and the web client are executed together using **Docker Compose**.
The mobile client is executed separately using **Expo**.

---

## Purpose of This Wiki

The purpose of this wiki is to demonstrate:

- How to build and run the complete system
- How all services are integrated and communicate with each other
- That the system is fully functional and behaves like a real application
- The main user flows required by the assignment:
    - Environment setup and system startup
    - User registration and login
    - File and folder management from different clients

Each section includes explanations, execution commands, and screenshots taken from
the running system.

---

## Wiki Structure

The wiki is organized as follows:

1. **[Environment Setup](environment-setup.md)**  
   Required tools, dependencies, and initial project configuration.


2. **[Running the Full System](run-all-services.md)**  
   Building and running all backend services and the web client using Docker Compose.


3. **[Mobile Client](mobile-client.md)**  
   Demonstration of the main user flows implemented in the mobile application, including authentication, file management, sharing, and trash handling.

## Notes

- No sensitive or real user data is stored in the project.
- All information shown in the clients is retrieved dynamically from the servers.
- The mobile client uses the same REST API as the web client.
- Screenshots included in the wiki were taken from the actual running system.
