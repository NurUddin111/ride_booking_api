# 🚖 Ride Booking System

A full-featured **Ride Booking System** built using modern web technologies. This system allows users to book rides, track drivers, and view ride histories. Admins and drivers have dedicated functionalities for managing rides efficiently.

---

## 🚀 Project Overview

The Ride Booking System is designed to provide a seamless experience for users to book and manage rides. It includes different user roles — **Rider**, **Driver**, and **Admin** — each with their own set of permissions and features.

This project focuses on **scalability**, **security**, and **clean API design**, making it a great foundation for a real-world ride-hailing application.

---

## ✨ Features

### 👤 Rider

- Sign up / Log in using JWT authentication
- Request a ride by providing passengers number,vehicle type, pickup and drop-off locations
- View real-time ride status updates (Pending, Vehicle Arrived, Ongoing, Completed)
- View ride history and total fares

### 🚗 Driver

- Accept or decline ride requests
- Update ride status (Vehicle Arrived → Ongoing → Completed)
- Track completed rides and total earnings

### 🛠️ Admin

- Manage all users (Riders, Drivers)
- Monitor all bookings and rides

### 🔐 General

- Secure authentication using **JWT**
- Centralized error handling and validation
- Scalable and modular backend structure

---

## 🧰 Tech Stack

| Category                   | Technologies                    |
| -------------------------- | ------------------------------- |
| **Backend**                | Node.js, Express.js, TypeScript |
| **Database**               | MongoDB, Mongoose               |
| **Authentication**         | JWT (JSON Web Tokens), Bcrypt   |
| **Validation**             | Zod                             |
| **API Testing**            | Postman                         |
| **Environment Management** | dotenv                          |
| **Version Control**        | Git & GitHub                    |

---

## 🧩 API Endpoints


---

### 👤 USER MODULE

---------------------------------------------------------------------------------------------------
| METHOD |            ENDPOINT           |           BODY             |      DESCRIPTION          |
---------------------------------------------------------------------------------------------------
| POST   | /api/v1/user/register-request | {                          | Create a new user         |
|        |                               |  "name": "John Doe",       | registration request.     |
|        |                               |  "email":"john@example.com"| Sends a 6 digit OTP to    |
|        |                               | }                          | verify email.             |
---------------------------------------------------------------------------------------------------
| POST   | /api/v1/user/register-verifi  | {                          | Verify user registration  |
|        | cation                        |  "otp": "123456"           | using OTP.                |
|        |                               | }                          |                           |
|        |                               |                            |                           |
---------------------------------------------------------------------------------------------------
| POST   | /api/v1/user/register-success | {                          | Complete user registration|
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

🧪 Testing the API
## 📮 Postman Collection

You can explore and test all the API endpoints using the Postman collection below:

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

🧠 Future Improvements
Add real-time location tracking with Socket.io

Implement payment gateway integration

Create frontend dashboard (Next.js / React)

Add push notifications for ride updates

👨‍💻 Author
Muhammad Nur Uddin

“Code. Learn. Repeat.”
📧 your.email@example.com
🌐 GitHub
```
