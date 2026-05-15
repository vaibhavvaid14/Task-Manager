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
*   **PostgreSQL & Sequelize** (SQL database with ORM)
-   **JWT (JSON Web Tokens)** (Secure stateless authentication)
-   **Bcrypt.js** (Password hashing)

## ⚙️ Getting Started

### Prerequisites
-   Node.js (v18+)
*   PostgreSQL database

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/vaibhavvaid14/Task-Manager.git
    cd Task-Manager
    ```

2.  **Install all dependencies** (Root, Client, and Server)
    ```bash
    npm run install-all
    ```

3.  **Setup Environment Variables**
    - Create a `.env` file in the root directory (see `.env.example`).
    - Add your `DATABASE_URL`, `JWT_SECRET`, and `VITE_API_URL`.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

### Environment Variables (.env)

**Root / Server:**
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/taskmanager
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

**Client:**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📈 Database Models

### User
-   `name`, `email`, `password`, `role` (Admin/Member), `profileImage`

### Project
-   `title`, `description`, `teamMembers` (Many-to-Many), `deadline`, `priority`, `status`, `progressPercentage`, `createdBy`

### Task
-   `title`, `description`, `project` (Ref to Project), `assignedUser` (Ref to User), `status`, `priority`, `dueDate`, `createdBy`

## 📦 Deployment

-   **Backend**: Optimized for **Railway** with PostgreSQL.
-   **Frontend**: Can be served via the backend or deployed to Vercel/Netlify.
-   **Root Configuration**: Use the provided `Procfile` for one-click deployment.

---
