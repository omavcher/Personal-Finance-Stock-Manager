import React, { useState, useEffect } from 'react';
import '../style/CreditCardPage.css'; // Ensure to add appropriate CSS for styling
import AlertComponent from '../components/AlertComponent.jsx';
import api from '../api.js';
import Loader from '../components/Loader.jsx';

function CreditCardPage() {
  const [creditCardDetails, setCreditCardDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };

  useEffect(() => {
    const fetchCreditCard = async () => {
      try {
        const response = await api.get(`/api/users/cradit/cards/info`);
        setCreditCardDetails(response.data);
        setLoading(false);
      } catch (err) {
        handleAlert('error', 'Error fetching credit card details. Please try again.');
        setLoading(false);
      }
    };

    fetchCreditCard();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  if (loading) return <Loader />;
  // You can manage this error state through the alert system already in use

  return (
    <div className="credit-card-page">
      {alert && <AlertComponent severity={alert.severity} message={alert.message} />}
      
      <header className="page-header">
        <h1>Top Credit Cards in India</h1>
        <p>Choose the best credit card to suit your needs and enjoy great rewards, benefits, and offers.</p>
      </header>

      <section className="credit-cards-list">
        {creditCardDetails.length > 0 ? (
          creditCardDetails.map((card) => (
            <div key={card.id} className="card-container">
              <img src={card.image} alt={card.name} className="card-image" />
              <h2>{card.name}</h2>
              <ul className="card-features">
                {card.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <a href={card.link} target="_blank" rel="noopener noreferrer">
                <button className="get-button">Get it</button>
              </a>
            </div>
          ))
        ) : (
          <p>No credit card details available.</p>
        )}
      </section>
    </div>
  );
}

export default CreditCardPage;
