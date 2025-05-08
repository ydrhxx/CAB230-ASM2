// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../components/LoginPage.css'; // Make sure this path is correct

const LoginPage = () => {
  // Local state for input fields and error display
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth(); // Grab login method from context

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://4.237.58.241:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          longExpiry: true, // Use long expiry for development
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save login info into context and localStorage
      login({ email }, data.bearerToken.token);
      localStorage.setItem('refreshToken', data.refreshToken.token);

      // Terminal debug
      console.log('Login successful');
      console.log('Logged in user:', email);
      console.log('Bearer token:', data.bearerToken.token);

      // Redirect after login
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        {/* Error message if login fails */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {/* Navigation to register page */}
      <p className="link-message">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
