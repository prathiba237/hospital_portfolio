# Hospital Appointment Booking System

This is a complete Full Stack web development project built as a college mini-project. It allows users to browse doctors, book appointments, and manage their bookings.

## Features
- **User Authentication**: Secure Login & Registration with JWT.
- **Doctor Directory**: View a list of specialists and their details.
- **Online Booking**: Logged-in users can book appointments easily.
- **My Appointments**: Users can track their own booking history.
- **Inquiry Form**: Public contact form for patient support.

## Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Security**: JWT (JSON Web Tokens), Bcryptjs for password hashing

---

## 🚀 How to Run Locally

### 1. Setup Environment
- Install [Node.js](https://nodejs.org/)
- Create a Cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- Create a `.env` file in the root folder with:
  ```env
  PORT=6000
  MONGO_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Project
```bash
node server/server.js
```
Open [http://localhost:6000](http://localhost:6000) in your browser.

---

## 💻 GitHub Workflow

1. `git init`
2. `git add .`
3. `git commit -m "hospital project complete"`
4. `git branch -M main`
5. `git remote add origin YOUR_REPO_URL`
6. `git push -u origin main`

## 🌍 Hosting
This project is ready for free hosting on:
- **Frontend/Backend**: Render, Railway, or Vercel (API).
- **Database**: MongoDB Atlas.

---
*Developed for College Mini Project Submission*
