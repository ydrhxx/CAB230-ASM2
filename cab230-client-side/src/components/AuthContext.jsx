import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Provider to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // Stores user info (e.g. { email })
  const [token, setToken] = useState(null);   // Stores current bearer token

  // Load stored credentials on mount
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('bearerToken');

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    } catch (err) {
      console.error('Error loading auth data:', err);
    }
  }, []);

  // Login: saves user and tokens
  const login = (userData, bearerToken) => {
    setUser(userData);
    setToken(bearerToken);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('bearerToken', bearerToken);
  };

  // Logout: calls backend and clears tokens
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (refreshToken) {
        await fetch('http://4.237.58.241:3000/user/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.warn('Logout failed or token already expired.');
    }

    // Clear all tokens regardless
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export hook to access auth context
export const useAuth = () => useContext(AuthContext);
