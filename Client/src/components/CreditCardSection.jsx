import React, { useEffect, useRef, useState } from 'react';
import '../style/CreditCardSection.css';

function CreditCardSection() {
  const creditCards = [
    {
      _id: "673e9b7cdb9db4d59f728333",
      id: 1,
      name: "HDFC Regalia Credit Card",
      image: "assets/cradit-cards/hdfcregalia.png",
      features: [
        "Earn 2 reward points for every Rs. 150 spent.",
        "Exclusive airport lounge access.",
        "Comprehensive insurance coverage."      ],
      link: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card"
    },
    {
      _id: "673e9b7cdb9db4d59f728334",
      id: 2,
      name: "SBI Card Elite",
      image: "assets/cradit-cards/sbielite.png",
      features: [
        "5% cashback on online purchases.",
        "2 complimentary airport lounge visits per quarter.",
        "Exclusive movie benefits and discounts.",
        "Premium membership offers."
      ],
      link: "https://www.sbicard.com/sprint/elite"
    }
  ];

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Scroll event listener to track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const screenWidth = window.innerWidth;

      // Trigger the animation based on scroll position and screen size
      if (screenWidth >= 1024 && scrollTop > 1000) { // For laptop screens
        setIsVisible(true);
      } else if (screenWidth < 1024 && scrollTop > 2300) { // For mobile screens
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`credit-card-section-1 ${isVisible ? 'animate-cards' : ''}`}
    >
      <h2 className="section-title-1">Our Featured Credit Cards</h2>
      <div className="credit-card-container-1">
        {creditCards.map((card) => (
          <div key={card.id} className="credit-card-card-1">
            <div className="card-content-1">
              <img
                className="card-image-1"
                src={card.image}
                alt={card.name}
              />
              <h3 className="card-name-1">{card.name}</h3>
              <div className="card-features-1">
                {card.features.map((feature, index) => (
                  <p key={index} className="card-feature-1">{feature}</p>
                ))}
              </div>
              <a
                className="view-btn-1"
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View All
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CreditCardSection;
