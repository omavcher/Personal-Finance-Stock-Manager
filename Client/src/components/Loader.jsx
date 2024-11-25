import React, { useEffect, useState } from 'react';
import '../style/Loader.css';

function Loader() {
  const financialTips = [
    "Save at least 20% of your income each month!",
    "Invest in a diversified portfolio to minimize risk.",
    "Review your subscriptions monthly to cut unnecessary costs.",
    "Create a budget to track your expenses effectively.",
    "Set financial goals and work towards achieving them.",
    "Build an emergency fund with 3-6 months of living expenses.",
    "Pay off high-interest debt as soon as possible.",
    "Consider investing in an IRA or 401(k) for retirement.",
    "Keep track of your credit score regularly.",
    "Plan for big expenses in advance to avoid debt.",
    "Automate your savings to ensure consistency.",
    "Avoid impulse purchases by making a list before shopping.",
    "Take advantage of employer-sponsored retirement plans.",
    "Review your insurance coverage annually to avoid overpaying.",
    "Refinance loans if you can get a lower interest rate.",
    "Consider renting instead of buying when you're uncertain about long-term commitments.",
    "Set up alerts for bill payments to avoid late fees.",
    "Track your net worth to measure your financial progress.",
    "Invest in yourself by acquiring new skills or certifications.",
    "Don’t be afraid to negotiate your salary or rates to reflect your value.",
  ];
  

  const financialImages = [
    "src/assets/l-1.jpg",
    "src/assets/l-2.jpg",
    "src/assets/l-3.jpg",
    "src/assets/l-4.webp",
    "src/assets/l-5.jpg",
    "src/assets/l-6.jpg",
    "src/assets/l-7.jpg",
    "src/assets/l-8.jpg",
    "src/assets/l-9.jpg",
    "src/assets/l-10.jpg",
    "src/assets/l-11.jpg",
    "src/assets/l-12.jpg",
  ];

  const randomColor = () => {
    const colors = [];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [tip, setTip] = useState("");
  const [image, setImage] = useState("");
  const [tipColor, setTipColor] = useState("");

  useEffect(() => {
    const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
    const randomImage = financialImages[Math.floor(Math.random() * financialImages.length)];
    const randomTipColor = randomColor();

    setTip(randomTip);
    setImage(randomImage);
    setTipColor(randomTipColor);
  }, []);

  return (
    <div className="Loader-container">
      <div className="financial-tip" style={{ color: tipColor }}>
        <img src={image} alt="Financial Tip" className="financial-image animate-image" />
        <p className="animate-tip">{tip}</p>
      </div>
    </div>
  );
}

export default Loader;
