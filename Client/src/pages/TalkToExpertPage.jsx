import React, { useState } from 'react';
import '../style/TalkToExpertPage.css';
import api from '../api'; // Axios instance must be pre-configured
import AlertComponent from '../components/AlertComponent.jsx'; 

function TalkToExpertPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // Handle errors
  const [alert, setAlert] = useState(null);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };
  // Simulated token - replace with real logic if needed
  const token = localStorage.getItem('authToken') || 'YOUR_STATIC_TOKEN_HERE';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/users/talk-with-me', formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setError(null); 
      } else {
        handleAlert('error', 'Error submitting. Please try again.');
      }
    } catch (err) {
      handleAlert('error', 'Something went wrong!');
    }
  };

  return (
    <div className="talk-to-expert">
      <header className="expert-header">
        <h1>Hey There! 👋</h1>
        <p>
          I'm <strong>Om Awchar</strong>, a proud MERN stack developer who built this very website!
        </p>
      </header>

      <section className="expert-intro">
        <div className="intro-container">
          <img
            src="src/assets/myPic.jpg"
            alt="Om Awchar smiling with code vibes"
            className="expert-photo"
          />
          <div className="intro-text">
  <h2>A Little About Me 😎</h2>
  <p>
    I love building web applications, solving bugs (mostly mine 🐛), and drinking
    copious amounts of chai ☕ while debugging JavaScript.
  </p>
  <p>
    This website is proof of my love for coding, sleepless nights, and battling APIs!
    Wanna know more or just say hi? Drop me a message below. I promise I won’t ghost you!
  </p>
  <div className="social-links">
    <a
      href="https://www.linkedin.com/in/omawchar"
      target="_blank"
      rel="noopener noreferrer"
      className="linkedin-button"
    >
 LinkedIn
    </a>
    <a
      href="https://github.com/omavcher"
      target="_blank"
      rel="noopener noreferrer"
      className="github-button"
    >
 GitHub
    </a>
  </div>
</div>

        </div>
      </section>

      <section className="fun-contact">
        <h3>Wanna Talk? 🚀</h3>
        <p>Fill out this form, and I’ll get back to you faster than a Node.js server processes a request! 🖥️</p>

        {submitted ? (
          <div className="success-message">
            <p>Thanks for reaching out! Now, I’ll find my chai, sit down, and reply to you. 🚀</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <input
              type="text"
              name="name"
              placeholder="Your Name (optional, but I’m curious!)"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email (I won't spam!)"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Say something funny or ask a serious question!"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className="submit-button-28">
              Send Message 📩
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default TalkToExpertPage;
