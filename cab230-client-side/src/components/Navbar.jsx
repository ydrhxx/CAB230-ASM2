// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the context
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear context and localStorage
        navigate('/login'); // Redirect to login page
    };

  return (
  <nav className="navbar">
    <Link to="/">Home</Link>
    <Link to="/movies">Movies</Link>

    {user ? (
      <>
        <span className="navbar-email">Welcome, {user.email}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </>
    )}
  </nav>
);
};

export default Navbar;
