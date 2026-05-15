# TaskMgr — Premium Team Task Management Platform

TaskMgr is a production-ready, full-stack SaaS application built for modern teams to manage projects, track tasks, and collaborate seamlessly.

![Hero Image](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)

## 🚀 Key Features

-   **Premium SaaS UI**: Modern, glassmorphic design with smooth animations and responsive layouts.
-   **Full CRUD Management**: Create, Read, Update, and Delete Projects and Tasks with real-time feedback.
-   **Role-Based Access Control**:
    -   **Admins**: Can manage all projects, tasks, and team members.
    -   **Members**: Can view assigned work and update their own task statuses.
-   **Kanban Board**: Interactive task board with Todo, In Progress, Review, and Completed columns.
-   **Analytics Dashboard**: Real-time insights using Recharts (Pie charts, Bar charts, Area trends).
-   **Team Management**: Centralized hub to view and manage organizational members.
-   **Secure Authentication**: JWT-based auth with encrypted passwords and protected routes.

## 🛠️ Tech Stack

### Frontend
-   **React + Vite** (Fast builds & modern features)
-   **Tailwind CSS** (Utility-first styling)
-   **React Router DOM** (Client-side routing)
-   **Lucide React** (Beautiful consistent icons)
-   **Recharts** (Interactive data visualizations)
-   **React Hot Toast** (Premium notification system)
-   **Axios** (API communication)

### Backend
-   **Node.js & Express.js** (Fast and scalable server)
-   **MongoDB Atlas & Mongoose** (NoSQL database integration)
-   **JWT (JSON Web Tokens)** (Secure stateless authentication)
-   **Bcrypt.js** (Password hashing)

## ⚙️ Getting Started

### Prerequisites
-   Node.js (v16+)
-   MongoDB Atlas account (or local MongoDB)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/vaibhavvaid14/Task-Manager.git
    cd Task-Manager
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    # Create a .env file based on .env.example
    # Add your MONGO_URI and JWT_SECRET
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

### Environment Variables (.env)

**Server:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

## 📈 Database Models

### User
-   `name`, `email`, `password`, `role` (Admin/Member), `avatar`

### Project
-   `title`, `description`, `teamMembers` (Refs to User), `deadline`, `priority`, `status`, `progressPercentage`

### Task
-   `title`, `description`, `project` (Ref to Project), `assignedUser` (Ref to User), `status`, `priority`, `dueDate`

## 📦 Deployment

-   **Backend**: Ready for Railway, Render, or Heroku.
-   **Frontend**: Optimized for Vercel or Netlify.

---

Built with ❤️ by Antigravity AI.