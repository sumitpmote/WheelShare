import React, { useState, useEffect } from 'react';
import { vehiclesAPI } from '../api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await vehiclesAPI.getMyVehicles();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to deactivate this vehicle?')) {
      return;
    }

    try {
      await vehiclesAPI.delete(vehicleId);
      alert('Vehicle deactivated successfully');
      fetchVehicles();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to deactivate vehicle');
    }
  };

  const getStatusBadge = (vehicle) => {
    if (!vehicle.isActive) return <span className="badge bg-secondary">Inactive</span>;
    if (vehicle.isVerified) return <span className="badge bg-success">Verified</span>;
    return <span className="badge bg-warning">Pending Verification</span>;
  };

  const VehicleModal = () => {
    const [vehicleData, setVehicleData] = useState(
      editingVehicle || {
        vehicleNumber: '',
        vehicleType: 'Cab',
        make: '',
        model: '',
        color: '',
        seatCapacity: 4
      }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log('Submitting vehicle data:', vehicleData);
        if (editingVehicle) {
          await vehiclesAPI.update(editingVehicle.vehicleId, vehicleData);
          alert('Vehicle updated successfully!');
        } else {
          const response = await vehiclesAPI.create(vehicleData);
          console.log('Vehicle creation response:', response);
          alert('Vehicle registered successfully! Awaiting admin verification.');
        }
        setShowModal(false);
        setEditingVehicle(null);
        fetchVehicles();
      } catch (error) {
        console.error('Vehicle registration error:', error);
        console.error('Error response:', error.response);
        alert(error.response?.data?.message || 'Operation failed');
      }
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingVehicle(null);
                }}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Vehicle Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicleData.vehicleNumber}
                    onChange={(e) => setVehicleData({...vehicleData, vehicleNumber: e.target.value})}
                    placeholder="e.g., MH12AB1234"
                    disabled={editingVehicle} // Can't edit vehicle number
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Vehicle Type</label>
                  <select
                    className="form-select"
                    value={vehicleData.vehicleType}
                    onChange={(e) => setVehicleData({...vehicleData, vehicleType: e.target.value})}
                  >
                    <option value="Cab">Cab</option>
                    <option value="Carpool">Carpool</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Make</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleData.make}
                      onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                      placeholder="e.g., Maruti"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                      placeholder="e.g., Swift"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      value={vehicleData.color}
                      onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Seat Capacity</label>
                    <select
                      className="form-select"
                      value={vehicleData.seatCapacity}
                      onChange={(e) => setVehicleData({...vehicleData, seatCapacity: parseInt(e.target.value)})}
                    >
                      {[2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehicle(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Vehicles</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          + Register New Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No vehicles registered</h4>
          <p className="text-muted">Register your first vehicle to start offering rides!</p>
        </div>
      ) : (
        <div className="row">
          {vehicles.map(vehicle => (
            <div key={vehicle.vehicleId} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">{vehicle.vehicleNumber}</h6>
                  {getStatusBadge(vehicle)}
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge bg-secondary me-2">
                      {vehicle.vehicleType}
                    </span>
                    <span className="text-muted">
                      {vehicle.seatCapacity} seats
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <strong>{vehicle.make} {vehicle.model}</strong>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">Color:</small>
                    <div>{vehicle.color}</div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Registered:</small>
                    <div>{new Date(vehicle.createdAt).toLocaleDateString()}</div>
                  </div>

                  {vehicle.verifiedAt && (
                    <div className="mb-2">
                      <small className="text-muted">Verified:</small>
                      <div>{new Date(vehicle.verifiedAt).toLocaleDateString()}</div>
                    </div>
                  )}

                  {!vehicle.isVerified && vehicle.isActive && (
                    <div className="alert alert-warning py-2 mt-2">
                      <small>
                        <strong>Pending Verification:</strong> Your vehicle is awaiting admin approval.
                      </small>
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <div className="d-grid gap-2">
                    {vehicle.isActive && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setEditingVehicle(vehicle);
                          setShowModal(true);
                        }}
                      >
                        Edit Details
                      </button>
                    )}
                    
                    {vehicle.isActive ? (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteVehicle(vehicle.vehicleId)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-muted text-center">
                        <small>Vehicle is inactive</small>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <VehicleModal />}
    </div>
  );
};

export default Vehicles;