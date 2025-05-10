// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth(); // Get current user and logout handler from context
  const navigate = useNavigate(); // Hook to handle navigation after logout

  // Handle logout logic
  const handleLogout = () => {
    logout(); // Clear user state and localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      {/* Always-visible navigation links */}
      <Link to="/">Home</Link>
      <Link to="/movies">Movies</Link>

      {/* Conditional rendering based on login status */}
      {user ? (
        <>
          {/* Show welcome message and logout button if user is logged in */}
          <span className="navbar-email">Welcome, {user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          {/* Show login and register links if user is not logged in */}
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
