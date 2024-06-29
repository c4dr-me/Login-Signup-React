# Login-Signup-React Project

This project implements a secure authentication system using React for the frontend and Node.js with Express and MongoDB for the backend.

## Features

- **Authentication**: Secure signup and login using bcrypt for password hashing and JWT tokens for authentication.
- **Frontend**: Built with React, utilizing React Router DOM for navigation.
- **Backend**: Node.js server with Express framework, MongoDB for data storage, and Mongoose for ORM.
- **Security**: Rate limiting, input validation, and cookies for safe JWT token transfer.
- **Deployment**: [Live Demo](https://login-signup-react-t8ka.onrender.com/)

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed locally or accessible remotely.
- Clone the repository from GitHub.

### Backend Setup

1. Clone the repository.
   ```bash
   git clone https://github.com/c4dr-me/Login-Signup-React.git
   cd Login-Signup-React/backend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=<your_mongodb_uri>
   NODE_ENV=development
   ```
4. Start the backend server.
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory.
   ```bash
   cd ../frontend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the frontend development server.
   ```bash
   npm run dev
   ```

## Usage

- Open your browser and go to `http://localhost:5173` to access the frontend.
- Sign up with a new account or log in with an existing one.
- Test various authentication functionalities such as error handling, successful login/signup, etc.
- Ensure the backend server is running on `http://localhost:5000`.

## Deployment

This project is currently deployed on Render. To deploy it on your own Render account:

1. Create a new Render service for both frontend and backend.
2. Configure environment variables on Render for `MONGO_URI`.
3. Deploy the backend directory and ensure the frontend build is set up correctly using a postinstall script (already done in backend package.json).

## Contributing

Contributions are welcome! Fork this repository, create new branch, make changes, and submit a pull request.

## License

This project is licensed under the [MIT License](./LICENSE).
