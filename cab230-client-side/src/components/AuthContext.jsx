// src/components/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// AuthProvider component wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Holds user object (e.g. { email: 'user@example.com' })
  const [token, setToken] = useState(null);     // Holds the JWT bearer token

  // On component mount, load user and token from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('bearerToken');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
  }, []);

  // Login method to store user and token
  const login = (userData, bearerToken) => {
    setUser(userData); // userData should be an object like { email: 'user@example.com' }
    setToken(bearerToken);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('bearerToken', bearerToken);
  };

  // Logout method to clear session
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('user');
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('refreshToken');
  };

  // Provide user, token, and auth functions to the rest of the app
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
