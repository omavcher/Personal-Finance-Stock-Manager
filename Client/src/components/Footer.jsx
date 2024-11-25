import React, { useEffect, useState } from 'react';
import '../style/Footer.css';

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footerPosition = document.getElementById('footer').getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (footerPosition < windowHeight) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer id="footer" className={`footer-1 ${isVisible ? 'animate-footer-1' : ''}`}>
      <div className="footer-content-1">
        <div className="footer-section-1">
          <h3 className="footer-title-1">About Us</h3>
          <p>PlanAhead is your trusted partner for financial planning and advice. Helping you build a secure future.</p>
        </div>
        
        <div className="footer-section-2">
          <h3 className="footer-title-2">Quick Links</h3>
          <ul>
            <li><a href="/services" className="footer-link-1">Services</a></li>
            <li><a href="/about" className="footer-link-2">About Us</a></li>
            <li><a href="/contact" className="footer-link-3">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section-3">
          <h3 className="footer-title-3">Follow Us</h3>
          <div className="social-icons-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-1">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-2">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-3">LinkedIn</a>
          </div>
        </div>

        <div className="footer-section-4">
          <p>For more financial planning tips, visit <a href="/" target="_blank" rel="noopener noreferrer" className="footer-link-4">PlanAhead</a></p>
        </div>
      </div>

      {/* Animated Figures */}
      <div className="footer-animated-figures">
        <div className="animated-circle-1"></div>
        <div className="animated-circle-2"></div>
      </div>
    </footer>
  );
}

export default Footer;
