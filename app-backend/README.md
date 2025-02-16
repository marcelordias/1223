# Backend Documentation

## Overview

This backend project is built using Node.js, Express, and TypeScript. It provides APIs for user authentication, user information retrieval, and real-time communication using Socket.IO.

## Project Structure

```
app-backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   ├── socket.ts
│   ├── index.ts
│   └── ...
├── node_modules/
├── package.json
├── package-lock.json
├── tsconfig.json
└── nodemon.json
```

- **src/controllers**: Contains the controller files for handling requests.
- **src/routes**: Contains the route definitions.
- **src/utils**: Contains utility functions.
- **src/socket.ts**: Socket.IO configuration and handling.
- **src/index.ts**: Entry point of the application.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd app-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the application in development mode with automatic restarts, use:
```bash
npm run dev
```

This will use `nodemon` to watch for changes and restart the server automatically.

## API Endpoints

### Authentication

- **POST /auth/login**: User login
  - Request body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "token": "string"
    }
    ```

### User

- **GET /user/info**: Get user information
  - Headers:
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
  - Response:
    ```json
    {
      "id": "string",
      "username": "string",
      "email": "string"
    }
    ```

## WebSocket

The application uses Socket.IO for real-time communication. The Socket.IO server is configured in `src/socket.ts`.

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/app-backend
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_prefered_time
```

## Scripts

- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start`: Start the application.
- `npm run dev`: Start the application in development mode with `nodemon`.

## License

This project is licensed under the MIT License.
