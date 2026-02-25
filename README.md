# coDrive Project

### **RESTful Web API, File Management & Full-Stack Distributed System**

This project implements a cloud-like file management system that exposes a RESTful Web API
alongside modern web and mobile client applications.

---

### Web-Based Full-Stack Extension

- A React web client that consumes the RESTful API
- Full JWT-based authentication and session handling
- A complete file manager UI (folders, files, previews, sharing)
- Support for **Starred**, **Trash**, **Recent**, and **Shared** views
- Integration of the web client, web server, and C++ server using Docker
- A unified `docker-compose` configuration for running the entire system
- End-to-end validation of the distributed architecture

All API endpoints return JSON responses and follow RESTful design principles.
The system is fully containerized and can be executed locally using a single
`docker-compose up` command, as required by the assignment specification.

---

### Mobile Client Extension

Assignment 5 further extends the system with a fully functional **React Native mobile client**
implemented using **Expo**.

The mobile application consumes the same RESTful API exposed by the Node.js web server
and provides equivalent core functionality to the web client, including:

- User registration and authentication
- File and folder browsing
- File upload and download from a mobile device
- File sharing with permission levels (view / edit)
- Starred and Trash views
- User profile management
- Light and Dark mode support

The mobile client is executed separately from the Dockerized backend services
and communicates with them over HTTP.
Detailed setup instructions, execution steps, and feature demonstrations
are documented in the project **Wiki** directory.

---
## Project Structure
```
coDrive/
├─ src/
│  ├─ server/                     # C++ TCP server (Assignment 2)
│  │  ├─ server.cpp               # TCP server entry point
│  │  ├─ ClientHandler.cpp        # Handles a single TCP client
│  │  └─ ClientHandler.h
│  │
│  ├─ commands/                   # Command implementations (Assignment 2)
│  │                               # Kept for backward compatibility
│  │
│  └─ client/                     # C++ / Python clients (Assignment 2)
│
├─ web-server/                    # Node.js REST API (Assignments 3–5)
│  ├─ controllers/                # HTTP request handlers
│  │  ├─ authController.js        # Authentication & token handling
│  │  ├─ filesController.js       # Files & folders CRUD logic
│  │  ├─ searchController.js      # Search endpoints
│  │  ├─ userController.js        # User management
│  │  └─ healthController.js      # Health check endpoint
│  │
│  ├─ middleware/                 # Express middlewares
│  │  ├─ authMiddleware.js        # Authentication & authorization
│  │  └─ errorMiddleware.js       # Centralized error handling
│  │
│  ├─ models/                     # Data models
│  │  ├─ user.model.js
│  │  └─ fileSystem.model.js
│  │
│  ├─ routes/                     # REST API routing
│  │  ├─ files.routes.js
│  │  ├─ user.routes.js
│  │  ├─ token.routes.js
│  │  ├─ search.routes.js
│  │  ├─ health.routes.js
│  │  └─ index.js
│  │
│  ├─ services/                   # Backend services
│  │  ├─ tcpClient.js             # TCP communication with C++ server
│  │  └─ cppServerClient.js       # Abstraction over C++ server protocol
│  │
│  ├─ server.js                   # Express server entry point
│  ├─ Dockerfile
│  └─ package.json
│
├─ web-client/                    # React web client (Assignment 4)
│  ├─ src/
│  │  ├─ components/              # UI and layout components
│  │  ├─ pages/                   # Drive, Login, Register, Trash, Starred, etc.
│  │  ├─ services/                # Frontend API services
│  │  └─ App.js                   # React root component
│  │
│  ├─ Dockerfile
│  └─ package.json
│
├─ mobile-client/                 # React Native mobile client (Assignment 5)
│  ├─ app/                        # Expo Router application
│  │  ├─ (auth)/                  # Authentication flow
│  │  │  ├─ login.jsx
│  │  │  └─ register.jsx
│  │  │
│  │  ├─ (tabs)/                  # Main application tabs
│  │  │  ├─ drive.jsx             # Drive view
│  │  │  ├─ files.jsx             # Files browser
│  │  │  ├─ shared.jsx            # Shared files
│  │  │  ├─ starred.jsx           # Starred files
│  │  │  └─ trash.jsx             # Trash view
│  │  │
│  │  └─ index.jsx                # Application entry point
│  │
│  ├─ components/                 # Reusable UI components
│  │  ├─ FileViewer.jsx
│  │  ├─ FileActionsModal.jsx
│  │  ├─ ShareModal.jsx
│  │  ├─ FloatingActionButton.jsx
│  │  ├─ ProfileModal.jsx
│  │  └─ SideDrawer.jsx
│  │
│  ├─ context/                    # Global application contexts
│  │  ├─ AuthContext.jsx          # Authentication state
│  │  └─ ThemeContext.jsx         # Light / Dark mode
│  │
│  ├─ services/                   # API communication layer
│  │  ├─ api.js                   # HTTP client wrapper
│  │  ├─ filesService.js          # Files & folders API
│  │  └─ useApiHooks.js
│  │
│  ├─ assets/                     # Images and static assets
│  ├─ .env.example                # Environment configuration example
│  ├─ app.json
│  └─ package.json
│
├─ docker-compose.yml             # Runs backend services and web client
├─ Dockerfile                     # C++ server Docker image
├─ CMakeLists.txt
├─ wiki/                          # Project Wiki (Assignment 5 documentation)
│  ├─ README.md                   # Wiki entry point
│  ├─ environment-setup.md
│  ├─ run-all-services.md
│  ├─ mobile-client.md
│  └─ screenshots/
│
└─ README.md                      # Project overview and architecture
```
---

## Additional Documentation (Wiki)

This README provides a high-level overview of the **coDrive** project, its architecture,
and its evolution across Assignments 1–5, with a particular focus on the final system design
and the mobile client extension introduced in Assignment 5.

For a detailed, step-by-step explanation of how to **set up the environment**, **run all system services**,
and **demonstrate the implemented features in practice**, please refer to the project **Wiki**
located in the `wiki/` directory.

The Wiki includes:
- Required tools and environment configuration
- Instructions for running all backend services and the web client using Docker Compose
- Mobile client execution using Expo (emulator and physical device)
- Screenshots and demonstrations of the main user flows implemented in Assignment 5
- Explanations of authentication, file management, sharing, and trash handling

The Wiki serves as the primary source for **execution instructions and functional demonstrations**,
while this README focuses on describing the system architecture and overall project structure.
