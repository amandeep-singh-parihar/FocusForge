# 🧠 FocusForge - Backend

**FocusForge** is a Student Productivity Dashboard that helps learners stay organized, focused, and motivated. This is the backend server built using **Node.js**, **Express**, and **MongoDB**, providing RESTful APIs for tasks, goals, Pomodoro sessions, daily progress summaries, and authentication.

---

## 🚀 Features

- ✅ User Authentication (Sign up, Login, JWT-based Auth)
- 📌 Task Management (Coming soon...)
- 🎯 Goal Tracking (Create, update, and monitor goals)
- ⏱ Pomodoro Timer Sessions (Start, stop, and track Pomodoro sessions)
- 📊 Daily Summary Reports (Track daily progress and time spent)
- ☁️ Cloudinary integration for profile pictures

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Bcrypt
- **File Upload:** Cloudinary
- **Environment Management:** dotenv
- **Validation:** Express-validator, custom middleware

---

## 📁 Project Structure
FocusForge-Backend/
│
├── config/ # Configuration files (Cloudinary, DB)
├── controllers/ # Request handlers
├── middlewares/ # Auth and error-handling middleware
├── models/ # Mongoose models
├── routes/ # API route definitions
├── utils/ # Utility functions
├── .env # Environment variables
├── index.js
└── package.json