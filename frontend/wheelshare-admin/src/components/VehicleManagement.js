import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await adminAPI.getAllVehicles();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to verify this vehicle?')) {
      return;
    }

    try {
      await adminAPI.verifyVehicle(vehicleId);
      alert('Vehicle verified successfully!');
      fetchVehicles();
    } catch (error) {
      alert('Failed to verify vehicle: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const getStatusBadge = (vehicle) => {
    if (!vehicle.isActive) return <span className="badge bg-secondary">Inactive</span>;
    if (vehicle.isVerified) return <span className="badge bg-success">Verified</span>;
    return <span className="badge bg-warning">Pending Verification</span>;
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const pendingVehicles = vehicles.filter(v => !v.isVerified && v.isActive);
  const verifiedVehicles = vehicles.filter(v => v.isVerified);

  return (
    <div className="container py-4">
      <h2>Vehicle Management</h2>

      {/* Pending Verification Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Pending Verification ({pendingVehicles.length})</h5>
        </div>
        <div className="card-body">
          {pendingVehicles.length === 0 ? (
            <p className="text-muted">No vehicles pending verification</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Vehicle Number</th>
                    <th>Type</th>
                    <th>Make/Model</th>
                    <th>Driver</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVehicles.map(vehicle => (
                    <tr key={vehicle.vehicleId}>
                      <td><strong>{vehicle.vehicleNumber}</strong></td>
                      <td>
                        <span className="badge bg-info">{vehicle.vehicleType}</span>
                      </td>
                      <td>{vehicle.make} {vehicle.model}</td>
                      <td>
                        <div>
                          <strong>{vehicle.driverName}</strong><br/>
                          <small className="text-muted">{vehicle.driverPhone}</small>
                        </div>
                      </td>
                      <td>{new Date(vehicle.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleVerifyVehicle(vehicle.vehicleId)}
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* All Vehicles Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">All Vehicles ({vehicles.length})</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Type</th>
                  <th>Make/Model</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.vehicleId}>
                    <td><strong>{vehicle.vehicleNumber}</strong></td>
                    <td>
                      <span className="badge bg-info">{vehicle.vehicleType}</span>
                    </td>
                    <td>{vehicle.make} {vehicle.model}</td>
                    <td>
                      <div>
                        <strong>{vehicle.driverName}</strong><br/>
                        <small className="text-muted">{vehicle.driverPhone}</small>
                      </div>
                    </td>
                    <td>{getStatusBadge(vehicle)}</td>
                    <td>{new Date(vehicle.createdAt).toLocaleDateString()}</td>
                    <td>
                      {vehicle.verifiedAt ? 
                        new Date(vehicle.verifiedAt).toLocaleDateString() : 
                        '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;