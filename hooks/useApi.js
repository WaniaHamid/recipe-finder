import { useState, useEffect } from 'react';
import { apiService } from '../lib/api';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired
        if (payload.exp * 1000 > Date.now()) {
          setUser(payload);
        } else {
          localStorage.removeItem('token');
          // Also clear server-side cookie by making a logout call
          fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        }
      } catch (error) {
        localStorage.removeItem('token');
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      const { token, user } = response.data;
      
      // Store in localStorage for client-side access
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      const { token, user } = response.data;
      
      // Store in localStorage for client-side access
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      setUser(null);
      
      // Clear server-side cookie
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server call fails, clear client state
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return { user, loading, login, register, logout };
};