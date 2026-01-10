# 🔗 MentorChain

A comprehensive platform designed to bridge the gap between mentors and mentees, facilitating seamless scheduling, real-time communication, and personalized learning roadmaps.

## ✨ Features

- **Role-Based Experience**: Dedicated dashboards for Mentors and Mentees with tailored functionalities.
- **Real-Time Communication**: Live chat functionality powered by Socket.io for instant interaction.
- **Session Management**: Easy session scheduling, requests, and overview with calendar integration.
- **Interactive Roadmaps**: Mentor-curated learning paths to guide mentees through their growth journey.
- **Community Hub**: A space for mentors and mentees to connect and share insights.
- **Modern UI/UX**: Fully responsive and animated interface built with React, Tailwind CSS, and Framer Motion.
- **Secure Authentication**: Robust JWT-based authentication for secure access.

## 🛠️ Tech Stack

**Frontend:**
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React + Vite**
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS**
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) **Framer Motion**
- **React Router DOM**
- **React Hot Toast**

**Backend:**
- ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) **Node.js**
- ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) **Express**
- ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=flat&logo=mysql&logoColor=white) **MySQL**
- ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white) **Socket.io**
- **JWT & Bcrypt**

## 🚀 Quick Start

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/MentorChain.git
cd MentorChain
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mentor_chain_db
DB_PORT=3306

# Authentication
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```bash
MentorChain/
│
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Dashboard, Home, Login)
│   │   ├── context/        # React Context for state management
│   │   └── assets/         # Images and static assets
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js application
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route logic and controllers
│   ├── models/             # Database models (MySQL)
│   ├── routes/             # API routes
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md
```

## 🎯 How It Works

1. **Sign Up/Login**: Users register as either a Mentor or a Mentee.
2. **Dashboard**: 
   - **Mentors** create and manage sessions, view requests, and build roadmaps.
   - **Mentees** browse mentors, schedule sessions, and track their progress on roadmaps.
3. **Connect**: Use the built-in messaging system to communicate in real-time.
4. **Grow**: Attend scheduled sessions and follow curated roadmaps to achieve learning goals.

## 📜 License

This project is licensed under the ISC License.
