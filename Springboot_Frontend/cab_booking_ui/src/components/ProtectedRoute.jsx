import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <div className="animate-spin" style={{ margin: '2rem auto', width: '40px', height: '40px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--surface-alt)', 
            borderTop: '4px solid var(--primary)', 
            borderRadius: '50%' 
          }}></div>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && user) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to={user.role === 'DRIVER' ? '/driver/dashboard' : '/home'} replace />;
  }

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;