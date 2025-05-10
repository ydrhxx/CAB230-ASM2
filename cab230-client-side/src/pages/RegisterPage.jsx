import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import '../components/RegisterPage.css'; 
import infoIcon from '../images/info-icon.png'; 

const RegisterPage = () => {
  const navigate = useNavigate(); // Hook for redirecting after successful registration

  // State for form input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // State for UI feedback messages
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle user registration when the form is submitted
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError('');
    setMessage('');

    // Basic client-side validation for matching passwords
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    // Send POST request to registration API endpoint
    try {
      const res = await fetch('http://4.237.58.241:3000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // If registration fails, show error message
      if (!res.ok) {
        setError(data.message || 'Registration failed.');
      } else {
        // If successful, show message and redirect to login after short delay
        setMessage('Registration successful!');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      // Catch any network or unexpected errors
      console.error('Registration error:', err);
      setError('Something went wrong.');
    }
  };

  return (
    <>
      <div className="register-page">
        <h2>Create Your Account</h2>
        {/* Registration form */}
        <form onSubmit={handleRegister}>
          {/* Email input */}
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input */}
          <label>Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Password guidance */}
          <div className="password-info">
            <img src={infoIcon} alt="info" className="info-icon" />
            <span>Password must be at least 8 characters long.</span>
          </div>

          {/* Confirm password input */}
          <label>Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {/* Submit button */}
          <button type="submit" className="blue-button">Create Account</button>

          {/* Feedback messages */}
          {error && <p className="error-msg">{error}</p>}
          {message && <p className="success-msg">{message}</p>}
        </form>

        {/* Link to login page if user already has an account */}
        <p className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
