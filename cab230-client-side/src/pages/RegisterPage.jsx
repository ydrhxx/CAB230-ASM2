import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Navbar must be present and correctly exported
import '../components/RegisterPage.css'; // Make sure the CSS path is correct

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Error and message state
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle register button submit
  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://4.237.58.241:3000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setMessage('Registration successful!');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-page">
        <h2>Create Your Account</h2>
        <form onSubmit={handleRegister}>

          {/* Email Input */}
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <label>Password</label>
          <input
            type="password"
            placeholder="at least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="password-info">
            <img src="/images/info-icon.png" alt="info" className="info-icon" />
            <span>Passwords must be at least 8 characters.</span>
          </div>

          {/* Confirm Password Input */}
          <label>Re-enter password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {/* Submit Button */}
          <button type="submit" className="blue-button">Create account</button>

          {/* Error and success messages */}
          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}
        </form>

        {/* Sign-in link */}
        <p className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
