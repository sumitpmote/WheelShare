import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, BarChart3, Car, UserCheck } from 'lucide-react';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ 
    drivers: 0, 
    customers: 0, 
    totalRides: 0, 
    completedRides: 0,
    totalUsers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2>Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Car size={48} color="#007bff" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#007bff' }}>{stats.drivers}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Drivers</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <Users size={48} color="#28a745" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#28a745' }}>{stats.customers}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Customers</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <BarChart3 size={48} color="#ffc107" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#ffc107' }}>{stats.totalRides}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Rides</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <UserCheck size={48} color="#17a2b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem', color: '#17a2b8' }}>{stats.completedRides}</h3>
          <p style={{ margin: 0, color: '#666' }}>Completed Rides</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* User Distribution Chart */}
        <div className="card">
          <h3>User Distribution</h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px'
          }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%',
              background: `conic-gradient(
                #007bff 0deg ${(stats.drivers / stats.totalUsers) * 360}deg,
                #28a745 ${(stats.drivers / stats.totalUsers) * 360}deg 360deg
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalUsers}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Total Users</div>
              </div>
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#007bff', 
                  marginRight: '0.5rem' 
                }}></div>
                <span>Drivers ({stats.drivers})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#28a745', 
                  marginRight: '0.5rem' 
                }}></div>
                <span>Customers ({stats.customers})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rides Distribution Chart */}
        <div className="card">
          <h3>Rides Distribution</h3>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px'
          }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              borderRadius: '50%',
              background: `conic-gradient(
                #17a2b8 0deg ${(stats.completedRides / stats.totalRides) * 360}deg,
                #ffc107 ${(stats.completedRides / stats.totalRides) * 360}deg 360deg
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalRides}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Total Rides</div>
              </div>
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#17a2b8', 
                  marginRight: '0.5rem' 
                }}></div>
                <span>Completed ({stats.completedRides})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#ffc107', 
                  marginRight: '0.5rem' 
                }}></div>
                <span>Pending ({stats.totalRides - stats.completedRides})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin/users')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Users size={20} />
            Manage Users
          </button>
          
          <button 
            onClick={() => navigate('/admin/users?filter=pending')}
            className="btn btn-warning"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FileText size={20} />
            Pending Verifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;