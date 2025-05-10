import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../components/LoginPage.css';

const LoginPage = () => {
  // Form input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Make login API request
      const res = await fetch('http://4.237.58.241:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      });

      const data = await res.json();

      // Handle failure
      if (!res.ok || !data.bearerToken?.token) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save auth details
      login({ email }, data.bearerToken.token);
      localStorage.setItem('bearerToken', data.bearerToken.token);
      localStorage.setItem('refreshToken', data.refreshToken.token);

      // Redirect to homepage
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
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

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <p className="link-message">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
