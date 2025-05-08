import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/RegisterPage.css';
import infoIcon from '../images/info-icon.png';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // UI feedback state
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Simple client-side check
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
        setError(data.message || 'Registration failed.');
      } else {
        setMessage('Registration successful!');
        setTimeout(() => navigate('/login'), 1500); // Redirect after success
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong.');
    }
  };

  return (
    <>

      <div className="register-page">
        <h2>Create Your Account</h2>
        <form onSubmit={handleRegister}>
          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="password-info">
            <img src="../images/info-icon.png" alt="info" className="info-icon" />
            <span>Password must be at least 8 characters long.</span>
          </div>

          {/* Confirm password */}
          <label>Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {/* Submit */}
          <button type="submit" className="blue-button">Create Account</button>

          {/* Feedback */}
          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}
        </form>

        {/* Redirect to login */}
        <p className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
