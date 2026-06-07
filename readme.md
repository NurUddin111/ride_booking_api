# 🚖 Safari - Backend Service

![Status](https://img.shields.io/badge/Status-Under%20Development-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-v1.0-blue?style=for-the-badge)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black)

A modern ride-sharing platform that connects riders and drivers through a secure, scalable, and role-based booking system.

Built with TypeScript, Node.js, Express.js, MongoDB, and JWT authentication.

---

## 📖 Overview

Safari is a backend-driven ride-sharing platform designed to streamline ride booking and management for riders, drivers, and administrators.

The platform supports ride requests, driver assignment, ride lifecycle tracking, earnings management, authentication, authorization, and administrative monitoring through a scalable RESTful architecture.

---

## 🔗 Project Links

- 🚀 Live Demo: Under Development
- 🌐 Frontend Repository: https://github.com/NurUddin111/safari-ride-sharing-app-frontend

---

## 🎯 Problem Statement

Traditional transportation booking systems often struggle with role management, ride tracking, and secure access control.

Safari was built to address these challenges by providing:

- Secure authentication and authorization
- Structured ride lifecycle management
- Role-based access control
- Driver earnings tracking
- Administrative monitoring capabilities

---

## 💡 Solution

Safari introduces a centralized ride management system where:

- Riders can request and monitor rides
- Drivers can manage ride requests and earnings
- Administrators can oversee platform operations

The platform follows a modular architecture to ensure scalability, maintainability, and future extensibility.

---

## ✨ Key Features

- Role-Based Access Control
- Ride Request & Booking Management
- Driver Assignment Workflow
- Ride Status Tracking
- Earnings Management
- JWT Authentication
- Google Authentication
- Password Recovery System
- Admin Monitoring Tools
- Secure API Architecture

---

## 🏗 Architecture Highlights

- Modular Folder Structure
- Service Layer Pattern
- Centralized Error Handling
- Role-Based Authorization
- Request Validation Middleware
- Secure Token-Based Authentication

---

## 📚 API Documentation

Safari exposes RESTful APIs for authentication, user management, and ride management.

### Available Modules

* Authentication
* Users
* Rides

For complete endpoint documentation, see:

📖 [API Documentation](./docs/api.md)

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/NurUddin111/ride_booking_api.git

# Navigate to the project directory
cd ride-booking-api

# Install dependencies
npm install

# Create an .env file
cp .env.example .env
# (Add your environment variables)

# Run the development server
npm run dev
```
---

## 🧪 Testing the API

### 📮 Postman Collection
- [Download Postman Collection](./postman/Ride-Booking-System.postman_collection.json)
- Set the base URL: http://localhost:1126

## 📁 Folder Structure

```text
src/
├── app/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   └── routes/
├── app.ts
└── server.ts
```

## 🧠 Future Improvements

- Integrate real-time ride tracking and driver location updates
- Implement secure online payment processing
- Develop a modern frontend application using Next.js
- Add in-app and email notifications for ride status updates
- Introduce ride scheduling and advance booking functionality
- Implement ratings and reviews for riders and drivers
- Add analytics and reporting dashboards for administrators
- Enhance scalability for high-volume ride requests
  
## 👨‍💻 Author

**Muhammad Nur Uddin**

Backend-Focused Full-Stack Developer

📧 Email: muhammadnur.codes@gmail.com

🌐 [Portfolio](https://muhammad-nur-uddin.vercel.app)

💼 [LinkedIn](https://www.linkedin.com/in/muhammad-nur-uddin)

🐙 [GitHub](https://github.com/NurUddin111)

> "Don't be shy, know the why!"

