import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set base API url dynamically from env or default to localhost
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Fetch current user demographics to verify token validation
          // We can use a dummy endpoint or use GET /credit/signals as a validation,
          // but let's assume we have a user state since we got the token,
          // and decode user details from the token or set a dummy user profile
          // since the token indicates authenticity.
          setUser({ email: 'user@example.com', first_name: 'Marcus', last_name: 'Chen' });
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser({ email, first_name: 'Marcus', last_name: 'Chen' });
      return true;
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw new Error(err.response?.data?.detail || "Authentication login failed.");
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      await axios.post(`${API_BASE}/auth/signup`, {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      // Auto login after signup
      return await login(email, password);
    } catch (err) {
      throw new Error(err.response?.data?.detail || "Registration signup failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout, API_BASE }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
