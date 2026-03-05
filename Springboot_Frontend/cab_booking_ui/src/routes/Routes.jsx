import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import CustomerHome from "../pages/CustomerHome";
import MapTest from "../pages/MapTest";
import BookRide from "../pages/BookRide";
import RideStatus from "../pages/RideStatus";
import RideHistory from "../pages/RideHistory";
import SavedPlaces from "../pages/SavedPlaces";
import DocumentUpload from "../pages/DocumentUpload";
import AboutUs from "../pages/AboutUs";
import Services from "../pages/Services";
import ContactUs from "../pages/ContactUs";
import DriverDashboard from "../pages/driver/DriverDashboard";
import DriverProfile from "../pages/driver/DriverProfile";
import OfferRide from "../pages/driver/OfferRide";
import MyRides from "../pages/driver/MyRides";
import RideBookings from "../pages/driver/RideBookings";
import DriverRideHistory from "../pages/driver/DriverRideHistory";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute requireAuth={false}>
          <Register />
        </ProtectedRoute>
      } />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      
      {/* Customer Protected Routes */}
      <Route path="/home" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <CustomerHome />
        </ProtectedRoute>
      } />
      <Route path="/book-ride" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <BookRide />
        </ProtectedRoute>
      } />
      <Route path="/ride-status" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <RideStatus />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <RideHistory />
        </ProtectedRoute>
      } />
      <Route path="/saved-places" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <SavedPlaces />
        </ProtectedRoute>
      } />
      
      {/* Document Upload Route - Available to both CUSTOMER and DRIVER */}
      <Route path="/documents" element={
        <ProtectedRoute allowedRoles={['CUSTOMER', 'DRIVER']}>
          <DocumentUpload />
        </ProtectedRoute>
      } />
      
      {/* Driver Protected Routes */}
      <Route path="/driver/dashboard" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <DriverDashboard />
        </ProtectedRoute>
      } />
      <Route path="/driver/profile" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <DriverProfile />
        </ProtectedRoute>
      } />
      <Route path="/driver/offer-ride" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <OfferRide />
        </ProtectedRoute>
      } />
      <Route path="/driver/my-rides" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <MyRides />
        </ProtectedRoute>
      } />
      <Route path="/driver/bookings" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <RideBookings />
        </ProtectedRoute>
      } />
      <Route path="/driver/history" element={
        <ProtectedRoute allowedRoles={['DRIVER']}>
          <DriverRideHistory />
        </ProtectedRoute>
      } />
      
      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageUsers />
        </ProtectedRoute>
      } />
      
      {/* Test Route */}
      <Route path="/map-test" element={<MapTest />} />
    </Routes>
  );
}

export default AppRoutes;
