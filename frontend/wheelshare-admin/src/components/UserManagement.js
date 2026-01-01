import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, driversResponse] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllDrivers()
      ]);
      setUsers(usersResponse.data);
      setDrivers(driversResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminAPI.blockUser(userId);
      fetchData(); // Refresh data
      alert('User status updated successfully');
    } catch (error) {
      alert('Error updating user status');
    }
  };

  const handleApproveDriver = async (driverId) => {
    try {
      await adminAPI.verifyDriver(driverId);
      fetchData(); // Refresh data
      alert('Driver approved successfully');
    } catch (error) {
      alert('Error approving driver');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            All Users ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('drivers')}
          >
            Drivers ({drivers.length})
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h5>All Users</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <span className={`badge bg-${user.role === 'Admin' ? 'danger' : user.role === 'Driver' ? 'warning' : 'primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${user.isActive ? 'success' : 'secondary'}`}>
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'Admin' && (
                          <button 
                            className={`btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => handleBlockUser(user.id)}
                          >
                            {user.isActive ? 'Block' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="card">
          <div className="card-header">
            <h5>Driver Management</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>Vehicles</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(driver => (
                    <tr key={driver.driverId}>
                      <td>{driver.fullName}</td>
                      <td>{driver.email}</td>
                      <td>{driver.phoneNumber}</td>
                      <td>{driver.licenseNumber}</td>
                      <td>{driver.vehicleCount}</td>
                      <td>
                        <span className={`badge bg-${driver.isVerified ? 'success' : 'warning'}`}>
                          {driver.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>{new Date(driver.createdAt).toLocaleDateString()}</td>
                      <td>
                        {!driver.isVerified && (
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleApproveDriver(driver.driverId)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;