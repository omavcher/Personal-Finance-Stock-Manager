import React, { useState } from 'react';
import '../style/ForgetPassword.css';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the form submission, e.g., send the email to the server
    setMessage(`Password reset link sent to ${email}. Please check your inbox.`);
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-box">
        <h2>Forgot Password?</h2>
        <p className="subtitle">Enter your email address below, and we'll send you a password reset link.</p>
        {message && <p className="success-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-btn">Send Reset Link</button>
        </form>
        <div className="footer-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
