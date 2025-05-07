import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || null);

  const login = (userEmail) => {
    localStorage.setItem('userEmail', userEmail);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('refreshToken');
    setEmail(null);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);