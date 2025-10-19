# Chattr

## Project Summary

**Chattr** is a full-stack real-time messaging application designed to provide seamless communication between users. It features a modern, responsive frontend and a robust backend, ensuring a smooth user experience and reliable performance.

---

## Frontend

- **Framework**: Built with **React.js** for a dynamic and responsive user interface.
- **State Management**: Powered by **Zustand** for efficient state handling.
- **Real-Time Updates**: Integrated with **Socket.IO** for instant message delivery.
- **Authentication**: Includes user-friendly login and registration forms with validation.

---

## Backend

- **Framework**: Developed using **Node.js** with **Express.js** for a scalable and efficient server.
- **Database**: Uses **MongoDB** for storing user data and chat history.
- **Authentication**: Implements **JWT (JSON Web Tokens)** for secure user authentication.
- **WebSocket Integration**: Leverages **Socket.IO** for real-time communication.
- **API Design**: RESTful APIs for seamless interaction between frontend and backend.

---

## Key Features

1. **Real-Time Messaging**: Instant communication with live updates.
2. **User Authentication**: Secure login and registration with token-based authentication.
3. **Responsive Design**: Fully optimized for both desktop and mobile devices.
4. **Chat History**: Persistent storage of messages for future reference.
5. **Scalability**: Designed to handle multiple users and concurrent chats efficiently.

## Running Locally

Follow these steps to run both the backend and frontend locally:

### 1. Clone the Repository

```bash
git clone <repo-url>
cd Chat-App
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create your environment variables
cp .env.example .env
# Edit the newly created .env file and fill in the required values:
# - MONGODB_URI
# - JWT_SECRET
# - NODE_ENV
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET

# Start the backend server (development mode)
npm run dev
```

### 3. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install

# Start the frontend development server
npm run dev
```

The frontend will typically run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:3000](http://localhost:3000) (or as configured).

---
