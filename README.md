# Project Documentation

## Live Demo

 [Click.me](https://marcelordias.github.io/1223) 

## Overview
This repository contains a full-stack application divided into two main parts: the **Frontend** and the **Backend**. The project has been developed with a focus on scalability, modularity, and real-time communication using Socket.io. Continuous integration and automated deployments ensure that updates are delivered quickly and reliably.

## Project Structure
1223/ 

    ├── app-frontend/ # Angular application with Tailwind CSS and DaisyUI 
    
    ├── app-backend/ # Node.js server with Express, Socket.io, and Mongoose
    
    ├── .github/workflows/
    
        ├── deploy-backend.yml # CICD for backend
        
        └── deploy-frontend.yml # CICD for frontend
        
    ├── ...
    
    └── README.md # General project documentation


## Technologies Used

### Frontend
- **Framework:** Angular
- **Language:** TypeScript
- **Styling:** Tailwind CSS and DaisyUI
- **Real-Time Communication:** Socket.io

### Backend
- **Environment:** Node.js
- **Framework:** Express
- **Real-Time Communication:** Socket.io
- **ODM:** Mongoose for MongoDB integration

### Database
- **Database:** MongoDB

## CI/CD Pipeline

- **Backend:**
  - Automated deployment to [Render](https://render.com) using **GitHub Actions**.
- **Frontend:**
  - Automated deployment to [GitHub Pages](https://pages.github.com) using **GitHub Actions**.

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm
- Access to a MongoDB instance

### Development Steps

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd 1223/
   ```

2. **Setup Frontend:**
   - Navigate to the `app-frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the application:
     ```bash
     npm run start
     ```
   - Access the application at `http://localhost:4200`.

3. **Setup Backend:**
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure environment variables (e.g., MongoDB URL, server port, etc.).
   - Start the server:
     ```bash
     npm run dev
     ```
   - The server will run on the configured port (default: 8001).

4. **Development Environment:**
   - Ensure that the MongoDB connection settings are correct.
   - Verify the Socket.io integration for real-time communication between the frontend and backend.

## Additional Notes

- **Language and Standardization:**  
  The entire codebase is written in TypeScript, ensuring static typing and greater robustness.
  
- **Modularity:**  
  The project is organized in a modular way, facilitating easy maintenance and scalability.

- **Deployments and CI/CD:**  
  The CI/CD pipeline ensures automated deployments for both the backend and frontend, streamlining the delivery process.

- **Real-Time Updates:**  
  Real-time communication is critical for this application, managed by Socket.io on both the frontend and backend.
