# Classroom Management System

A full-stack Classroom Management System developed to simplify classroom administration by providing a centralized platform for managing subjects, attendance, notes, announcements, polls, and examinations. The system supports role-based access for Class Representatives (CR) and Students, ensuring secure and efficient academic management.

## Features

### Authentication
- Secure JWT-based login
- Role-based access control (CR & Student)
- Protected routes

### Subject Management
- Create, edit, and delete subjects (CR)
- View subject details
- Organized subject dashboard

### Attendance Management
- Mark attendance by date (CR)
- View attendance records
- Student-wise attendance tracking
- Attendance percentage calculation

### Notes Management
- Upload study materials (CR)
- Download notes
- Subject-wise organization

### Announcements
- Create announcements (CR)
- View latest announcements
- Edit and delete announcements

### Polls
- Create classroom polls (CR)
- Vote once per poll
- View poll results

### Examination Module
- Create examinations (CR)
- Store syllabus/portion

### User Interface
- Responsive design
- Clean and modern dashboard

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3
- Bootstrap Icons

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer

### Database
- PostgreSQL

## Project Structure

```
Frontend
├── Components
├── Pages
├── Services
├── Styles

Backend
├── Controllers
├── Routes
├── Middleware
├── Database
├── Uploads
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/classroom-management.git
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Future Improvements

- Forgot Password using OTP
- Email Notifications
- Calendar Integration
- Assignment Submission
- File Preview
- Attendance Analytics
- Mobile Responsive Improvements

## Author

Developed by **Harshadh M S**
