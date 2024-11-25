import React from 'react';
import '../style/InviteYourLovedOnes.css';
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';

function InviteYourLovedOnes() {
  const shareMessage = encodeURIComponent(
    `💰 Want to take control of your personal finances? Check out this awesome platform: PlanAhead! 🔥 It's packed with tools, personalized advice, and tips to help you grow your savings and investments. Start your financial journey today! 🚀 https://PlanAhead.com`
  );

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareMessage}`,
    instagram: `https://instagram.com/`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=https://PlanAhead.com`,
    twitter: `https://twitter.com/intent/tweet?text=${shareMessage}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://PlanAhead.com`,
    github: 'https://github.com/', // Update this with your platform's GitHub page
  };

  return (
    <div className="invite-page">
      <header className="invite-header">
        <h1>Invite Your Loved Ones to Master Their Finances 💸</h1>
        <p>
          At <strong>PlanAhead</strong>, we provide personalized financial tools and tips to help individuals grow their wealth, plan for the future, and build solid financial habits.
        </p>
        <ul>
          <li>💡 Personalized Financial Advice</li>
          <li>📊 Smart Budgeting Tools</li>
          <li>📈 Investment Guidance</li>
          <li>💳 Credit Management Tips</li>
        </ul>
        <p>
          Help your friends and family take control of their financial future. Share the platform with them and let’s make financial success a reality for everyone! 🌟
        </p>
      </header>

      <section className="share-section">
        <h3>Share the Financial Freedom 🌍</h3>
        <p>Spread the word about how easy it is to take control of finances with PlanAhead! Click on the icons below to share:</p>
        <div className="social-links">
          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="social-button whatsapp">
            <FaWhatsapp /> WhatsApp
          </a>
          <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-button instagram">
            <FaInstagram /> Instagram
          </a>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-button facebook">
            <FaFacebook /> Facebook
          </a>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-button twitter">
            <FaTwitter /> Twitter
          </a>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-button linkedin">
            <FaLinkedin /> LinkedIn
          </a>
          <a href={shareLinks.github} target="_blank" rel="noopener noreferrer" className="social-button github">
            <FaGithub /> GitHub
          </a>
        </div>
      </section>
    </div>
  );
}

export default InviteYourLovedOnes;
