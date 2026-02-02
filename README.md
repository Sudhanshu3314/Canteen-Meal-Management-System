
 🍽️ Canteen Meal Management System (CMMS)

 📌 Project Documentation



 1. Introduction

The Canteen Meal Management System (CMMS) is a fullstack web application designed to digitize and automate meal attendance tracking for an institutional canteen.
The system helps in managing Lunch and Dinner attendance, generating daily reports, and providing adminlevel summaries to avoid food wastage and manual record keeping.

This project is developed using React, Node.js, Express, and MongoDB, with rolebased access for Guests, Users, and Admins.



 2. Objectives

The main objectives of CMMS are:

 ✅ Eliminate manual attendance registers
 ✅ Track daily lunch & dinner attendance
 ✅ Provide realtime reports to administrators
 ✅ Reduce food wastage through accurate counts
 ✅ Offer a simple and responsive user interface
 ✅ Secure the system using authentication & authorization



 3. System Overview

 3.1 HighLevel Architecture


Frontend (React + Tailwind)
        |
        |  REST API (JSON)
        |
Backend (Node.js + Express)
        |
        |
Database (MongoDB Atlas)




 4. Technology Stack

 4.1 Frontend

 React.js
 Tailwind CSS
 Ant Design (Admin UI)
 Framer Motion (animations)
 Fetch API

 4.2 Backend

 Node.js
 Express.js
 JWT Authentication
 CORS
 Dotenv

 4.3 Database

 MongoDB
 Mongoose ODM

 4.4 Hosting

 Frontend: Vercel
 Backend: Vercel
 Database: MongoDB Atlas



 5. Project Structure


CanteenMealManagementSystem
│
├── CMMSAdminPortal
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   └── App.js
│
├── CMMSGuestPortal
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.js
│
├── CMMSGuestBackend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── models
│   ├── index.js
│   └── .env
│
└── README.md




 6. User Roles & Access Control

 6.1 Guest / User

 Mark lunch attendance
 Mark dinner attendance
 View their submission status

 6.2 Admin

 View lunch & dinner reports
 View daily summaries
 Export reports
 Access protected routes



 7. Authentication & Authorization

 7.1 Authentication Method

 JWT (JSON Web Token) based authentication

 7.2 Flow

1. User logs in / verifies identity
2. Server generates JWT token
3. Token stored in localStorage
4. Token sent in Authorization header
5. Backend validates token using middleware



 8. Backend API Documentation

 8.1 Authentication APIs

| Endpoint       | Method | Description  |
|  |  |  |
| /auth/login  | POST   | Login user   |
| /auth/verify | POST   | Verify token |



 8.2 Lunch APIs

| Endpoint        | Method | Auth          | Description           |
|  |  |  |  |
| /lunch        | POST   | Yes           | Submit lunch response |
| /lunch        | GET    | Yes           | Get user lunch status |
| /lunch/report | GET    | Admin / Guest | Fetch lunch report    |



 8.3 Dinner APIs

| Endpoint         | Method | Auth  | Description            |
|  |  |  |  |
| /dinner        | POST   | Yes   | Submit dinner response |
| /dinner        | GET    | Yes   | Get dinner status      |
| /dinner/report | GET    | Admin | Fetch dinner report    |



 9. Database Design

 9.1 User Schema

js
{
  name: String,
  email: String,
  role: String,
}


 9.2 Lunch / Dinner Schema

js
{
  name: String,
  email: String,
  status: "Yes" | "No",
  date: String,
  count: Number
}




 10. Frontend Modules

 10.1 Guest Portal

 Home Page
 Meal Selection Page
 Submission Confirmation

 10.2 Admin Portal

 Dashboard
 Meal Summary Cards
 Today’s Report Table
 CSV Export Feature



 11. Report Generation Logic

 Reports are datebased
 API accepts query:


?date=YYYYMMDD


 Only current day records are fetched
 Summary calculates:

   Total Active Members
   Members Having Meal
   Members Not Having Meal



 12. UI & Responsiveness

 Fully responsive (Mobile / Tablet / Desktop)
 Tailwind utilitybased layouts
 Ant Design tables for reports
 Gradient backgrounds for better UX



 13. Environment Variables

 Backend .env


MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=8080


 Frontend .env


REACT_APP_BACKEND_URL=https://yourbackendurl
REACT_APP_GUEST_B=https://guestbackendurl




 14. Installation & Setup

 Step 1: Clone Repository

bash
git clone https://github.com/Sudhanshu3314/CanteenMealManagementSystem.git


 Step 2: Backend Setup

bash
cd CMMSGuestBackend
npm install
npm start


 Step 3: Frontend Setup

bash
cd CMMSAdminPortal
npm install
npm start




 15. Advantages of the System

 ✔️ Timesaving
 ✔️ Accurate meal count
 ✔️ Easy admin access
 ✔️ Secure authentication
 ✔️ Scalable architecture



 16. Future Enhancements

 📱 Mobile App
 📊 Graphical analytics
 📧 Email notifications
 🧾 Monthly reports
 👥 Role management UI



 17. Conclusion

The Canteen Meal Management System provides an efficient and reliable solution for managing daily meal attendance in institutions. It minimizes wastage, reduces manual work, and ensures transparency through realtime reporting.



 18. Author

Sudhanshu



