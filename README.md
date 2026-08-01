# 🚀 Task Management System

A production-ready full-stack task management application that enables teams to manage projects, assign tasks, collaborate efficiently, and track work progress through a secure role-based system.

---

# 📌 Project Overview

This project was built as a Full Stack Technical Assessment using modern backend and frontend technologies.

The application allows authenticated users to create projects, invite team members, assign tasks, monitor task status, and manage project workflows while enforcing secure role-based access control.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Authorization (Admin / Member)

---

## 👥 User Management

- View Users
- User Profiles
- User Roles
- Search Users
- Pagination

---

## 📁 Project Management

- Create Project
- Update Project
- Delete Project
- View Project Details
- Project Members Management
- Admin-only Member Control

---

## ✅ Task Management

Each task contains:

- Title
- Description
- Status
- Priority
- Due Date
- Creator
- Assignee

Supported Statuses

- To Do
- In Progress
- Done

Supported Features

- Task Assignment
- Task Filtering
- Status Updates
- Priority Filtering
- Assignee Filtering

---

## 🎨 Frontend Features

- Authentication Pages
- Dashboard
- Projects Page
- Task Board (Kanban)
- Task Table View
- Responsive Design
- Loading States
- Error States
- Empty States
- Client-side Validation
- Protected Routes

---

# 🛠 Tech Stack

## Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Passport
- bcrypt
- Swagger
- Jest

---

## Frontend

- React
- Vite
- TypeScript
- React Router
- React Query
- Zustand
- React Hook Form
- Zod
- Axios
- Ant Design

---

## Database

- PostgreSQL

---

## DevOps

- Docker
- Docker Compose

---

# 📂 Project Structure

```
task-management-app
│
├── backend
│   ├── src
│   │   ├── common
│   │   ├── config
│   │   ├── database
│   │   ├── modules
│   │   └── types
│   └── test
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── store
│   │   ├── types
│   │   ├── utils
│   │   └── schemas
│
└── docker-compose.yml
```

---

# 🏗 Architecture

The project follows a scalable layered architecture.

Backend

```
Controller
      ↓
Service
      ↓
Repository
      ↓
Database
```

Frontend

```
Pages
      ↓
Components
      ↓
Hooks
      ↓
API Layer
      ↓
Backend API
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role-based Authorization
- Request Validation
- DTO Validation
- Global Exception Filter
- Validation Pipes
- Protected APIs
- Environment Variables

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/AhmedOsamaAhmedAhmed/task-management-app.git
```

```bash
cd task-management-app
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create

```
.env
```

using

```
.env.example
```

Run

```bash
npm run start:dev
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Run

```bash
npm run dev
```

---

# 🐳 Docker

Start the complete application

```bash
docker-compose up --build
```

---

# 🧪 Testing

Backend Tests

```bash
npm run test
```

Coverage

```bash
npm run test:cov
```

E2E

```bash
npm run test:e2e
```

---

# 📚 API Documentation

Swagger

```
http://localhost:3000/api/docs
```

---

# 📋 Environment Variables

Example

```
PORT=

DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=

NODE_ENV=
```

---

# 🚀 Bonus Features

- Swagger Documentation
- Docker Support
- WebSocket Ready
- Pagination
- Search
- Filtering
- Audit Logs
- Responsive UI

---

# 📈 Git Workflow

The project was developed incrementally using meaningful commits that reflect real development progress.

Examples

- Project Initialization
- Database Configuration
- Authentication Module
- Users Module
- Projects Module
- Tasks Module
- Frontend Components
- Dashboard
- Validation
- Testing

---

# 📸 Screenshots

You can place application screenshots inside:

```
docs/screenshots
```

Example

```
Login Page

Dashboard

Projects

Task Board

Task Details
```

---

# 👨‍💻 Author

**Ahmed Osama Ahmed**

Software Developer

GitHub

https://github.com/AhmedOsamaAhmedAhmed

LinkedIn

(Add your LinkedIn profile here)

---

# 📄 License

This project was created for educational purposes and technical assessment.
