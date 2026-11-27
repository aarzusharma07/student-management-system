#  Academix – Student Management Portal

Academix is a secure MERN stack portal with JWT login and role-based access for student records.

Designed with a premium dark theme, glassmorphism-inspired UI, and smooth user experience, Academix helps educational institutions efficiently manage student information while maintaining security and performance.

---

## Overview

Academix is a full-stack web application that enables institutions to:

- Manage student records efficiently
- Store and update student information
- Upload and manage profile pictures
- Generate analytical insights through dashboards
- Export student data in CSV format
- Implement secure authentication and authorization
- Control user permissions through Role-Based Access Control (RBAC)

---

## Features

### Authentication & Authorization

- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected Frontend & Backend Routes
- Session Management
- Role-Based Access Control (RBAC)
- Secure Login System

#### User Roles

| Role | Permissions |
|--------|------------|
| Admin | Full Access |
| Staff | View Student Records |
| Viewer | Read-Only Access |

---

## Dashboard & Analytics

The dashboard provides real-time student insights and analytics.

#### Dashboard Features

- Total Students Counter
- Branch-wise Distribution
- Semester-wise Statistics
- Recent Activities
- Responsive Charts
- Performance Metric Cards

#### Visualizations

- Bar Charts
- Pie Charts
- Student Distribution Graphs
- Semester Analytics

Built using **Recharts** for interactive data visualization.

---

## Student Management (CRUD)

#### Add Student

- Register new students
- Upload profile pictures
- Assign branch and semester
- Validate student information

#### View Students

- Paginated student table
- Quick search functionality
- Branch badges
- Responsive design

#### Edit Student

- Update student information
- Modify profile details
- Replace profile pictures

#### Delete Student

- Confirmation modal before deletion
- Automatic image cleanup
- Permanent record removal

---

## Search & Filtering

Search students using:

- Student ID
- Name
- Email
- Phone Number

Filter students by:

- Branch
- Semester

---

## Profile Image Upload

Implemented using **Multer**.

Features:

- Local image storage
- Live image preview
- External image URL support
- Automatic file cleanup
- Profile image replacement

---

## CSV Export

Export student records instantly.

Benefits:

- Client-side processing
- No server load
- Excel-compatible format
- Proper data formatting

---

## Dark Mode Support

- Light Mode
- Dark Mode
- Local Storage Persistence
- Smooth Theme Switching

---

## Toast Notifications

Real-time notifications for:

- Success Actions
- Error Messages
- Warning Alerts
- Informational Updates

---

# Screenshots

### Login Page
<img width="1364" height="902" alt="image" src="https://github.com/user-attachments/assets/0264052e-44d3-42e0-8317-6882bab27819" />

### Dashboard

<img width="1516" height="1003" alt="image" src="https://github.com/user-attachments/assets/4be74957-fb36-40c1-9974-9aa65f01b96b" />


### Student Directory
<img width="1825" height="981" alt="image" src="https://github.com/user-attachments/assets/b5950253-5c05-4c33-8f30-6e5fe6a05f1c" />

### Add Student Form
<img width="1820" height="922" alt="image" src="https://github.com/user-attachments/assets/15b7e00f-c86d-443c-a8f8-f0de01c08f06" />

### Student Profile

<img width="1828" height="982" alt="image" src="https://github.com/user-attachments/assets/b1900e01-a5cf-4ad2-ada3-4e079ab287de" />

### Dark Mode Interface

<img width="1800" height="970" alt="image" src="https://github.com/user-attachments/assets/78bb74c5-aa7c-4318-83b9-60a292c93cd1" />



##  Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- bcryptjs

---

## System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express API Server
 │
 ▼
MongoDB Database
```

### Authentication Flow

```text
User Login
 │
 ▼
JWT Token Generated
 │
 ▼
Protected Routes
 │
 ▼
Authorized Access
```

---

## Project Structure

```text
student-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── studentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Student.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── uploads/
│   ├── scripts/
│   │   └── seed.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

# Installation Guide

### Prerequisites

Make sure the following are installed:

- Node.js (v16 or higher)
- MongoDB
- Git

---

### Clone Repository

```bash
git clone https://github.com/your-username/academix.git

cd academix
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Configure `.env`:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/student-management-db

JWT_SECRET=your_jwt_secret_key
```

Start backend server:

```bash
npm run dev
```

Server runs at:

```text
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

# Database Seeding

Populate sample data:

```bash
npm run seed
```

Seeder creates:

- 1 Admin Account
- 16 Student Records

---

# API Endpoints

### Authentication APIs

```http
POST /api/auth/login
POST /api/auth/register
```

### Student APIs

```http
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

---

# Demo Credentials

### Admin Login

```text
Username: admin

Email: admin@school.com

Password: admin123
```

---

# Security Features

- JWT Authentication
- Password Encryption
- Protected Routes
- Input Validation
- Role-Based Authorization
- Secure API Access
- File Upload Validation

---

# Future Enhancements

- Attendance Management System
- Fee Management System
- Student Performance Analytics
- Email Notifications
- SMS Notifications
- Cloudinary Integration
- AWS S3 Storage
- Multi-Admin Support
- Report Generation
- Mobile Application

---

# Performance Optimizations

- Pagination
- Optimized MongoDB Queries
- Lazy Loading
- Reusable Components
- Context API State Management
- Axios Interceptors

---

# Author

**Aarzu sharma**

Full Stack Developer

---

# License

This project is developed for educational, learning, internship, and portfolio purposes.

---
 If you found this project useful, consider giving it a star on GitHub.
