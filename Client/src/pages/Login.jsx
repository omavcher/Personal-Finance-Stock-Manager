import React, { useState, useEffect } from 'react';
import '../style/SignUp.css'; // Reuse the styling for consistent look
import OtpInput from 'react-otp-input';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../components/AlertComponent.jsx'; 

function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    document.title = 'PlanAhead - Login';
    return () => {
      document.title = 'PlanAhead';
    };
  }, []);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (value) => setOtp(value);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setOtpSent(false); // Allow "Resend Code" button to be active
    }
  }, [otpSent, timer]);

  const sendOtp = async () => {
    try {
      const response = await api.post('/api/users/otp', { email });
      if (response.data.message === 'OTP sent successfully!') {
        setOtpSent(true);
        setTimer(60); // Reset the timer
      } else {
        handleAlert('error', 'Error sending OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await api.post('/api/users/verify-otp', { email, otp });
      if (response.data.message === 'OTP verified successfully!') {
        setOtpVerified(true);
        handleLogin();
  } else {
    handleAlert('error', 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };


  const handleLogin = async () => {
    try {
      const response = await api.post('/api/users/login', { email });
      if (response.data.message === 'Login successful') {
        localStorage.setItem('Authorization', `Bearer ${response.data.token}`);
        localStorage.setItem('userID', JSON.stringify(response.data.user._id));
        navigate('/'); // Redirect after successful login
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };


  return (
    <div className="sign-up-container">
            {alert && <AlertComponent severity={alert.severity} message={alert.message} />}

      <div className="sign-up-box">
        <h2>Login to Your Account</h2>

        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {!otpSent && email.length > 3 && (
          <button
            className={email.length > 3 ? 'btn' : 'non-btn'}
            type="button"
            onClick={sendOtp}
            disabled={otpSent || email.length < 3}
          >
            Send OTP
          </button>
        )}

        {otpSent && (
          <div>
            <div className="input-group">
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} style={{ color: 'black', backgroundColor: 'white' }} />}
              />
            </div>

            <button
              className={otp.length === 6 ? 'verify-btn' : 'verify-non-btn'}
              type="button"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>

            {timer > 0 ? (
              <p className="footer-links">Resend code in {timer} seconds</p>
            ) : (
              <button className="otp-btn" onClick={sendOtp}>Resend Code</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
