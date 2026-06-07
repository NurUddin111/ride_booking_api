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

## 🧩 API Endpoints

---

### 👤 USER MODULE

    ---------------------------------------------------------------------------------------------------
    | METHOD |            ENDPOINT           |           BODY             |      DESCRIPTION          |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/user/signup           | {                          | Create a new user         |
    |        |                               |  "name": "John Doe",       | registration request.     |
    |        |                               |  "email":"john@example.com"| Sends a 6 digit OTP to    |
    |        |                               | }                          | verify email.             |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/user/signup/verify    | {                          | Verify user registration  |
    |        |                               |  "otp": "123456"           | using OTP.                |
    |        |                               | }                          |                           |
    |        |                               |                            |                           |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/user/signup/password  | {                          | Complete user registration|
    |        |                               |  "password": "Abc123@&$",  |                           |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/user                  |                            | Get All Users(Admin Only) |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/user/me               |                            | Get logged-in user profile|
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/user/:id              |                            | Get single user by Id     |
    |        |                               |                            | (Admin Only)              |
    ---------------------------------------------------------------------------------------------------
    | PATCH  | /api/v1/user/:id              | {                          | Update user details.      |
    |        |                               |  "name":"Mark Henry",      |                           |
    |        |                               |  "phone":"+880...",        |                           |
    |        |                               | ...                        |                           |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | PATCH  | /api/v1/user/vehicle-locat    | {                          | Update driver’s vehicle   |
    |        |  ion/:id                      |  "address":"...address"    | location                  |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | PATCH  | /api/v1/user/delete/:id       |                            | Soft delete a user        |
    ---------------------------------------------------------------------------------------------------

---

### 🔐 AUTH MODULE

    ---------------------------------------------------------------------------------------------------
    | METHOD |            ENDPOINT           |           BODY             |      DESCRIPTION          |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/login            |                            | Login using email and     |
    |        |                               |                            | password                  |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/auth/google           |                            | Login via Google OAuth    |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/auth/google/callback  |                            | Google login callback     |
    |        |                               |                            | handler                   |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/refresh-token    |                            | Get a new access token    |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/logout           |                            | Logout user (invalidate   |
    |        |                               |                            | token)                    |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/change-password  | {                          | Change user password      |
    |        |                               |  "oldPass": "123...",      |                           |
    |        |                               |  "newPass": "654...",      |                           |
    |        |                               |  "confirmNewPass": "654..."|                           |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/set-password     | {                          | Set new password (for     |
    |        |                               |  "password": "123456"      | first-time login)         |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/forgot-password  | {                          | Send reset link to user   |
    |        |                               |  "email":"john@example.com"| email                     |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/auth/reset-passw      | {                          | Reset password using token|
    |        | ord/:id                       |  "newPass":"654...",       |                           |
    |        |                               |  "confirmNewPass":"654..." |                           |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------

---

### 🚖 RIDE MODULE

    ---------------------------------------------------------------------------------------------------
    | METHOD |            ENDPOINT           |           BODY             |       DESCRIPTION         |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/ride/ride-request     | {                          | Create a ride request     |
    |        |                               |  "totalPassengers": "2",   | (Rider/Driver/Admin)      |
    |        |                               |  "vehicleType": "CAR",     |                           |
    |        |                               |  "pickupAddress":"Khulshi",|                           |
    |        |                               |  "destinationAddress":"CRB"|                           |
    |        |                               | }                          |                           |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/ride/pending-ride-re  |                            | Get all pending ride      |
    |        | quests                        |                            |requests (Driver/Admin)    |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/ride/all-rides        |                            | Get all rides (Admin only)|
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/ride/my-rides         |                            |Get rides for logged-in    |
    |        |                               |                            |user/driver                |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/ride/:id              |                            | Get single ride           |
    |        |                               |                            |details (Admin)            |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/ride/accept-ride/:id  |                            | Accept ride request       |
    |        |                               |                            |(Driver)                   |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/ride/cancel-ride/:id  |                            | Cancel ride (Rider/Driver/|
    |        |                               |                            | Admin)                    |
    ---------------------------------------------------------------------------------------------------
    | POST   | /api/v1/ride/update-ride/:id  | {                          | Update ride status or     |
    |        |                               |  "rideStatus": "ONGOING"   | details                   |
    |        |                               | }                          | details                   |
    ---------------------------------------------------------------------------------------------------
    | GET    | /api/v1/ride/view-earnings/:id|                            | View driver’s earnings    |
    ---------------------------------------------------------------------------------------------------

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

    You can explore and test all the API endpoints using the Postman collection below.

    🔗 **[Ride Booking System – Postman Collection](https://api.postman.com/collections/46020985-28f401dc-b363-43c7-b0a9-77daa1b346d6?access_key=PMAT-01K6WD09C5A1E19M5H0B3BMSWQ)**

    Set the base URL: http://localhost:5000

📁 Folder Structure

    src/
    │
    ├── app/
    │   ├── config/
    │   ├── errorHelpers/
    │   ├── helpers/
    │   ├── interfaces/
    │   ├── middlewares/
    │   ├── modules/
    │   ├── routes/
    │   ├── utils/
    │   └── constants.ts
    │
    ├── app.ts
    └── server.ts

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

📧 Email: nuruddinmuhammad38@gmail.com

💼 [LinkedIn](https://www.linkedin.com/in/muhammad-nur-uddin)

🐙 [GitHub](https://github.com/NurUddin111)

> "Don't be shy, know the why!"
