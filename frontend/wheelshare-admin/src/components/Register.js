import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [otpData, setOtpData] = useState({ email: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert('Please enter email first');
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendRegistrationOtp(formData.email);
      setOtpData({ ...otpData, email: formData.email });
      setShowOtp(true);
      alert('OTP sent to your email');
    } catch (error) {
      alert('Failed to send OTP: ' + (error.response?.data?.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.verifyRegistrationOtp(otpData);
      setEmailVerified(true);
      setShowOtp(false);
      alert('Email verified successfully!');
    } catch (error) {
      alert('OTP verification failed: ' + (error.response?.data?.message || 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailVerified) {
      alert('Please verify your email first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        ...formData,
        role: 'Admin'
      });
      alert('Admin registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="text-center mb-4">Verify Email</h3>
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
                  <button type="submit" className="btn btn-dark w-100" disabled={loading}>
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Admin Registration</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={emailVerified}
                      required
                    />
                    {!emailVerified && (
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
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
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100" disabled={loading || !emailVerified}>
                  {loading ? 'Registering...' : 'Register as Admin'}
                </button>
                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    className="btn btn-link"
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;