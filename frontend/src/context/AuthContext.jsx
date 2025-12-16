import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logged out successfully');
  };

  const updateUserPreferences = async (preferences) => {
    try {
      const data = await authService.updatePreferences(preferences);
      setUser({ ...user, preferences: data.preferences });
      return data;
    } catch (error) {
      toast.error('Failed to update preferences');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserPreferences,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};