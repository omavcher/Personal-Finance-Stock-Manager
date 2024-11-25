import React, { useState } from 'react';
import '../style/SupportFAQs.css';

function SupportFAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How can I sign up for PlanAhead?",
      answer: "To sign up, simply click on the 'Sign Up' button at the top of the page, enter your details, and start your financial journey with PlanAhead."
    },
    {
      question: "What services does PlanAhead offer?",
      answer: "We offer personalized financial advice, budgeting tools, investment guidance, and credit management tips to help you manage your money effectively."
    },
    {
      question: "How do I reset my password?",
      answer: "If you forgot your password, go to the login page and click on 'Forgot Password'. Enter your email address, and we'll send you a reset link."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription anytime from your account settings. However, we recommend exploring all features before making that decision."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach out to our customer support team via the contact form on this page or email us directly at support@PlanAhead.com."
    }
  ];

  return (
    <div className="support-faqs-page">
      <header className="support-header">
        <h1>Support & FAQs</h1>
        <p>If you have any questions, check out our frequently asked questions or contact us directly.</p>
      </header>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() => toggleAnswer(index)}
              >
                <h3>{faq.question}</h3>
                <span>{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Need More Help?</h2>
        <p>If you can't find what you're looking for, feel free to contact us. We're here to help!</p>
        <button className="contact-button">Contact Support</button>
      </section>
    </div>
  );
}

export default SupportFAQs;
