import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use sessionStorage instead of localStorage for per-tab isolation
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            userId: sessionStorage.getItem('userId'),
            name: sessionStorage.getItem('userName'),
            role: sessionStorage.getItem('role'),
            token
          });
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userId, role, name) => {
    // Use sessionStorage for per-tab/window isolation
    // Each tab will have its own session
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('userName', name || '');
    setUser({ userId, name: name || '', role, token });
  };

  const logout = () => {
    // Clear sessionStorage for current tab only
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userName');
    setUser(null);
  };

  const isAuthenticated = () => !!user;
  const isDriver = () => user?.role === 'DRIVER';
  const isCustomer = () => user?.role === 'CUSTOMER';
  const isAdmin = () => user?.role === 'ADMIN';

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated,
    isDriver,
    isCustomer,
    isAdmin,
    loading
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};