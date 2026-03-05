# WheelShare Frontend

A modern, responsive React frontend for the WheelShare ride-sharing application, built with Vite and designed to work seamlessly with the .NET backend API.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, login, email verification with OTP
- **Ride Booking**: Interactive map-based ride booking with fare estimation
- **Real-time Tracking**: Live ride status updates and driver tracking
- **Ride History**: Complete history with filtering and statistics
- **Modern UI**: Clean, responsive design with smooth animations

### Driver Features
- **Driver Dashboard**: Real-time ride management and earnings tracking
- **Location Services**: GPS-based location tracking and updates
- **Ride Management**: Accept, start, and complete rides
- **Earnings Overview**: Daily earnings and ride statistics

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Leaflet & React-Leaflet** - Interactive maps
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer component
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── BookRide.jsx    # Ride booking interface
│   ├── RideStatus.jsx  # Real-time ride tracking
│   ├── RideHistory.jsx # Ride history and stats
│   └── driver/         # Driver-specific pages
│       ├── DriverDashboard.jsx
│       └── ...
├── services/           # API service layers
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication APIs
│   ├── rideService.js  # Ride management APIs
│   └── driverService.js # Driver-specific APIs
├── routes/             # Routing configuration
│   └── Routes.jsx
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles and design system
```

## 🎨 Design System

The frontend uses a comprehensive design system with:

- **Color Palette**: Modern tech-inspired colors with primary, secondary, and accent colors
- **Typography**: Outfit and Plus Jakarta Sans fonts for headings and body text
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Components**: Reusable button, card, and input components
- **Animations**: Smooth transitions and micro-interactions

## 🔧 API Integration

### Backend Endpoints Used

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - User login

**Rides (Customer):**
- `POST /api/rides/estimate-fare` - Get fare estimate
- `POST /api/rides/request` - Request a ride

**Driver:**
- `POST /api/driver/go-online` - Driver goes online
- `POST /api/driver/go-offline` - Driver goes offline
- `POST /api/driver/update-location` - Update driver location
- `GET /api/driver/nearby-rides` - Get nearby ride requests
- `POST /api/driver/accept-ride/{id}` - Accept a ride
- `POST /api/driver/start-ride/{id}` - Start a ride
- `POST /api/driver/complete-ride/{id}` - Complete a ride

### Authentication Flow

1. User registers with email, phone, password, and role
2. OTP sent to email for verification
3. User verifies email with OTP
4. User can login and receive JWT token
5. Token stored in localStorage and sent with all API requests

## 🗺 Map Integration

- Uses OpenStreetMap with Leaflet for interactive maps
- Nominatim geocoding service for address to coordinates conversion
- Real-time location tracking for drivers
- Interactive markers for pickup and drop locations

## 📱 Responsive Design

- Mobile-first approach with responsive grid layouts
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly interface elements
- Adaptive navigation for different screen sizes

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5298/api
```

### Backend Configuration
Ensure the .NET backend is running on `http://localhost:5298` or update the API base URL in `src/services/api.js`.

## 🎯 Key Features Implementation

### Real-time Updates
- Driver location updates every 10 seconds when online
- Ride status polling for real-time updates
- Automatic refresh of nearby rides for drivers

### Error Handling
- Comprehensive error handling for all API calls
- User-friendly error messages
- Loading states for better UX

### Security
- JWT token-based authentication
- Automatic token attachment to API requests
- Protected routes based on user roles

## 🔮 Future Enhancements

- WebSocket integration for real-time updates
- Push notifications for ride updates
- Payment gateway integration
- Advanced map features (route optimization, traffic data)
- Offline support with service workers
- Progressive Web App (PWA) capabilities

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use the established design system for consistency
3. Add proper error handling and loading states
4. Test on multiple devices and browsers
5. Update documentation for new features

## 📄 License

This project is part of the WheelShare application suite.