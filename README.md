# WheelShare - Complete Full-Stack Cab Booking & Carpooling System

## 🚀 Project Overview

WheelShare is a comprehensive cab booking and carpooling platform built with .NET 8 Web API backend and React frontends. The system supports three user roles: Admin, Customer, and Driver with complete functionality for ride management, booking, and administration.

## 🏗️ Architecture

### Backend (.NET 8 Web API)
- **Clean Architecture** with Domain, Application, Infrastructure layers
- **ASP.NET Core Identity** for authentication
- **JWT + OTP** two-factor authentication
- **Entity Framework Core** with SQL Server
- **RESTful APIs** for all operations

### Frontend (React)
- **Three separate applications** for different user roles
- **Bootstrap 5** for responsive UI
- **Axios** for API communication
- **React Router** for navigation

## 📁 Project Structure

```
WheelShare2/
├── WheelShare/Backend/CabBookingSystem/
│   ├── CabBooking.API/                 # Web API Controllers
│   ├── WheelShare.Application/         # Business Logic
│   ├── WheelShare.Domain/             # Entities & Models
│   └── WheelShare.Infrastructure/     # Data Access
├── frontend/
│   ├── wheelshare-admin/              # Admin Dashboard
│   ├── wheelshare-customer/           # Customer App
│   └── wheelshare-driver/             # Driver App
└── start-wheelshare.bat              # Startup Script
```

## 🔧 Setup Instructions

### Prerequisites
- .NET 8 SDK
- Node.js (v16+)
- SQL Server
- Visual Studio Code or Visual Studio

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd WheelShare/Backend/CabBookingSystem/CabBooking.API
   ```

2. Update connection string in `appsettings.json`

3. Run migrations:
   ```bash
   dotnet ef database update
   ```

4. Start the API:
   ```bash
   dotnet run
   ```

### Frontend Setup
For each frontend application:

1. **Admin Frontend:**
   ```bash
   cd frontend/wheelshare-admin
   npm install
   npm start
   ```

2. **Customer Frontend:**
   ```bash
   cd frontend/wheelshare-customer
   npm install
   npm start
   ```

3. **Driver Frontend:**
   ```bash
   cd frontend/wheelshare-driver
   npm install
   npm start
   ```

### Quick Start
Run the provided batch file:
```bash
start-wheelshare.bat
```

## 🌐 Access URLs

- **Backend API:** http://localhost:5052
- **Admin Panel:** http://localhost:3000
- **Customer App:** http://localhost:3001
- **Driver App:** http://localhost:3002

## 👥 User Roles & Features

### 🔐 Admin Features
- **Dashboard:** System statistics and overview
- **User Management:** Approve/block customers and drivers
- **Vehicle Verification:** Approve driver vehicles
- **Ride Monitoring:** View all rides and bookings
- **System Administration:** Complete platform control

### 👤 Customer Features
- **Registration & Login:** OTP-based authentication
- **Ride Search:** Find cabs and carpools by location
- **Booking Management:** Book rides, view history, cancel bookings
- **Real-time Updates:** Notifications for booking status
- **Profile Management:** Update personal information

### 🚗 Driver Features
- **Registration & Login:** OTP-based authentication
- **Vehicle Management:** Register and manage vehicles
- **Ride Creation:** Create cab/carpool rides
- **Booking Management:** View and manage ride bookings
- **Earnings Tracking:** Monitor income and ride statistics
- **Status Updates:** Update ride status (Open/In Progress/Completed)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & get JWT

### Rides
- `POST /api/rides/search` - Search available rides
- `POST /api/rides` - Create new ride (Driver)
- `GET /api/rides/my-rides` - Get driver's rides
- `PUT /api/rides/{id}/status` - Update ride status

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get customer bookings
- `GET /api/bookings/ride/{rideId}` - Get ride bookings (Driver)
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### Vehicles
- `POST /api/vehicles` - Register vehicle
- `GET /api/vehicles/my-vehicles` - Get driver vehicles
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Deactivate vehicle

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/status` - Update user status
- `PUT /api/admin/vehicles/{id}/verify` - Verify vehicle

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

## 🗄️ Database Schema

### Core Entities
- **ApplicationUser** - User authentication & profile
- **DriverProfile** - Driver-specific information
- **CustomerProfile** - Customer-specific information
- **Vehicle** - Driver vehicles
- **Ride** - Available rides
- **Booking** - Customer bookings
- **Notification** - User notifications
- **Rating** - Ride ratings
- **Payment** - Payment records

## 🔒 Security Features

- **JWT Authentication** with role-based authorization
- **OTP Verification** for secure login
- **Password Hashing** using ASP.NET Core Identity
- **CORS Configuration** for frontend integration
- **Input Validation** and sanitization
- **SQL Injection Protection** via Entity Framework

## 🚀 Key Features Implemented

### ✅ Phase 1 - Admin Dashboard (Completed)
- Admin authentication with OTP
- Dashboard with system statistics
- User management (customers & drivers)
- Vehicle verification system
- Complete admin panel UI

### ✅ Phase 2 - Customer Frontend (Completed)
- Customer registration and login
- Ride search functionality
- Booking management
- Notifications system
- Responsive UI design

### ✅ Phase 3 - Driver Frontend (Completed)
- Driver registration and login
- Vehicle registration and management
- Ride creation and management
- Booking oversight
- Earnings tracking

### ✅ Phase 4 - Backend APIs (Completed)
- Complete RESTful API implementation
- All CRUD operations
- Authentication and authorization
- Data validation and error handling

## 🔄 Workflow

### Customer Journey
1. Register/Login with OTP verification
2. Search for rides by source/destination
3. View available cabs and carpools
4. Book rides with seat selection
5. Receive booking confirmations
6. Track ride status
7. Rate completed rides

### Driver Journey
1. Register/Login with OTP verification
2. Register vehicle (awaits admin approval)
3. Create rides with route and pricing
4. Manage ride bookings
5. Update ride status
6. Track earnings

### Admin Journey
1. Login to admin panel
2. Monitor system statistics
3. Approve/reject driver registrations
4. Verify vehicle documents
5. Manage user accounts
6. Oversee platform operations

## 🛠️ Technology Stack

### Backend
- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **ASP.NET Core Identity** - Authentication
- **JWT** - Token-based auth
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **React Hooks** - State management

### Development Tools
- **Visual Studio Code** - IDE
- **Postman** - API testing
- **SQL Server Management Studio** - Database management
- **Git** - Version control

## 📊 Performance Features

- **Efficient Database Queries** with EF Core
- **Lazy Loading** for related entities
- **Pagination** for large datasets
- **Caching** for frequently accessed data
- **Optimized API Responses** with DTOs
- **Responsive Design** for all devices

## 🔮 Future Enhancements

- **Real-time Chat** between drivers and customers
- **GPS Tracking** for live ride tracking
- **Payment Gateway** integration
- **Push Notifications** via SignalR
- **Mobile Apps** (React Native)
- **Advanced Analytics** and reporting
- **Multi-language Support**
- **Rating & Review System**

## 📝 Development Notes

- **Clean Code** principles followed
- **SOLID** design patterns implemented
- **Repository Pattern** for data access
- **Dependency Injection** throughout
- **Error Handling** with try-catch blocks
- **Logging** for debugging and monitoring
- **Unit Testing** ready structure

## 🎯 Project Status: COMPLETE ✅

All phases of the WheelShare full-stack project have been successfully implemented:

- ✅ Backend API with all controllers and endpoints
- ✅ Admin dashboard with complete functionality
- ✅ Customer frontend with ride search and booking
- ✅ Driver frontend with ride and vehicle management
- ✅ Authentication system with OTP verification
- ✅ Database schema with all required entities
- ✅ Responsive UI design for all applications
- ✅ Complete CRUD operations for all features

The project is ready for deployment and production use!