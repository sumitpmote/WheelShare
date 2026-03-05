import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { adminService } from '../../services/adminService';

function AdminRevenue() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    platformFee: 0,
    driverEarnings: 0,
    completedRides: 0,
    driverRevenue: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await adminService.getRevenue();
        setRevenueData(data);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <div>Loading revenue data...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Revenue Overview</h2>

      {/* Revenue Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#f8f9fa' }}>
          <DollarSign size={48} color="#28a745" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#28a745' }}>
            ₹{revenueData.totalRevenue}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Total Revenue</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#e8f5e8' }}>
          <TrendingUp size={48} color="#007bff" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#007bff' }}>
            ₹{revenueData.platformFee}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Platform Fee (10%)</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fff3cd' }}>
          <Users size={48} color="#ffc107" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#ffc107' }}>
            ₹{revenueData.driverEarnings}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Driver Earnings (90%)</p>
        </div>
      </div>

      {/* Driver Revenue Breakdown */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Driver Revenue Breakdown</h3>
        {revenueData.driverRevenue.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No completed rides found
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    Driver Name
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                    Rides
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>
                    Total Fare
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>
                    Driver Earning
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>
                    Platform Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenueData.driverRevenue.map((driver, index) => (
                  <tr key={driver.DriverId} style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' 
                  }}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #dee2e6' }}>
                      {driver.DriverName || `Driver #${driver.DriverId}`}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                      {driver.RideCount}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>
                      ₹{driver.totalFare}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #dee2e6', color: '#28a745' }}>
                      ₹{driver.driverEarning}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #dee2e6', color: '#007bff' }}>
                      ₹{driver.platformFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRevenue;