import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fieldops_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fieldops_token') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Save auth token and user object
  const setAuthData = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    if (userData) {
      localStorage.setItem('fieldops_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('fieldops_user');
    }

    if (tokenData) {
      localStorage.setItem('fieldops_token', tokenData);
    } else {
      localStorage.removeItem('fieldops_token');
    }
  };

  // Validate token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('fieldops_token');
      if (storedToken) {
        try {
          setIsLoading(true);
          const data = await apiRequest('/auth/me', {
            method: 'GET'
          });
          if (data.success) {
            setAuthData(data.user, storedToken);
          } else {
            // Token invalid
            setAuthData(null, '');
          }
        } catch (error) {
          console.error('Failed to verify token on startup:', error);
          // If server is unavailable, keep the cached user for seamless offline/fallback testing
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Register User Method
  const register = async (formData) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (data.success) {
        setAuthData(data.user, data.token);
        return data.user;
      }
    } catch (error) {
      setAuthError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login User Method
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data.success) {
        setAuthData(data.user, data.token);
        return data.user;
      }
    } catch (error) {
      setAuthError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Demo 1-Click Login for Fast Testing
  const demoLogin = (role) => {
    const demoUsers = {
      admin: { _id: 'demo_admin_1', name: 'FieldOps Admin', email: 'admin@fieldops.com', role: 'admin', location: 'Kolhapur HQ' },
      technician: { _id: 'demo_tech_1', name: 'Rahul Sharma', email: 'rahul@fieldops.com', role: 'technician', specialty: 'AC & HVAC', rating: 4.9 },
      customer: { _id: 'demo_cust_1', name: 'Roshani Kadam', email: 'roshani@gmail.com', role: 'customer', location: 'Sector 62, Kolhapur' }
    };

    const targetUser = demoUsers[role] || demoUsers.customer;
    const fakeToken = `demo_jwt_token_${role}_${Date.now()}`;
    setAuthData(targetUser, fakeToken);
    return targetUser;
  };

  // Logout Method
  const logout = () => {
    setAuthData(null, '');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        authError,
        setAuthError,
        register,
        login,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
