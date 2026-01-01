import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    experience: ''
  });
  const [otpData, setOtpData] = useState({ email: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter email first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authAPI.sendRegistrationOtp(formData.email);
      setOtpData({ ...otpData, email: formData.email });
      setShowOtp(true);
      setSuccess('OTP sent to your email');
    } catch (error) {
      setError('Failed to send OTP: ' + (error.response?.data?.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.verifyRegistrationOtp(otpData);
      setEmailVerified(true);
      setShowOtp(false);
      setSuccess('Email verified successfully!');
    } catch (error) {
      setError('OTP verification failed: ' + (error.response?.data?.message || 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailVerified) {
      setError('Please verify your email first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: 'Driver'
      });
      
      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow" style={{ width: '400px' }}>
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h2 className="text-success">WheelShare</h2>
              <p className="text-muted">Verify Email</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <p className="text-center text-muted">OTP sent to {otpData.email}</p>
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  value={otpData.otp}
                  onChange={(e) => setOtpData({...otpData, otp: e.target.value})}
                  maxLength="6"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                type="button" 
                className="btn btn-link w-100 mt-2"
                onClick={() => setShowOtp(false)}
              >
                Back to Registration
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '450px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="text-success">WheelShare</h2>
            <p className="text-muted">Driver Registration</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={emailVerified}
                  required
                />
                {!emailVerified && (
                  <button 
                    type="button" 
                    className="btn btn-outline-success"
                    onClick={handleSendOtp}
                    disabled={loading || !formData.email}
                  >
                    Send OTP
                  </button>
                )}
                {emailVerified && (
                  <span className="input-group-text bg-success text-white">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">License Number</label>
              <input
                type="text"
                className="form-control"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="Driving license number"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Driving Experience (Years)</label>
              <select
                className="form-select"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">Select experience</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading || !emailVerified}
            >
              {loading ? 'Registering...' : 'Register as Driver'}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Already have an account?{' '}
              <button
                className="btn btn-link p-0"
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;