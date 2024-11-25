import React, { useState } from 'react';
import '../style/SignUp.css';
import api from '../api';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../components/AlertComponent.jsx'; 

function SignUp() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    jobType: '',
    monthsalary: '',
  });

  const navigate = useNavigate(); // Use navigate for redirection
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    document.title = 'PlanAhead - SignUp';
    return () => {
      document.title = 'PlanAhead';
    };
  }, []);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (value) => setOtp(value);

  const sendOtp = async () => {
    try {
      const response = await api.post('/api/users/otp', { email });
      if (response.data.message === 'OTP sent successfully!') {
        setOtpSent(true);
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
        setStep(2); // Move to the next step after verification
      } else {
        handleAlert('error', 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/register', { ...formData, email });
      if (response.data.message === 'successfully') {
        handleLogin();
      }if (response.data.message === 'already-registered') {
        alert(`${response.data.alreemail} -> is already registered`);
      } else {
        handleAlert('error', `Registration failed${response.data.message} Please Log-In`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      handleAlert('error', 'Error during registration');
    }
  };

  // Function to handle login after signup
  const handleLogin = async () => {
    try {
      const response = await api.post('/api/users/login', { email });
      if (response.data.message === 'Login successful') {
        localStorage.setItem('Authorization', `Bearer ${response.data.token}`);
        localStorage.setItem('userID', JSON.stringify(response.data.user._id));
        navigate('/'); // Redirect after successful login
      } else {
        handleAlert('error', 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="sign-up-container">
                  {alert && <AlertComponent severity={alert.severity} message={alert.message} />}
      <div className="sign-up-box">
        {step === 1 && (
          <>
            <h2>What's your email?</h2>
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
                Verify Email Address
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
              </div>
            )}
          </>
        )}
        {step === 2 && otpVerified && (
          <div>
            <h3>Personal and Financial Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <select
                  className="job-type-select"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Job Type</option>
                  <option value="Government">Government</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Retired">Retired</option>
                  <option value="Housewife">Housewife</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Monthly Salary"
                  name="monthsalary"
                  value={formData.monthsalary}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Sign Up</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
