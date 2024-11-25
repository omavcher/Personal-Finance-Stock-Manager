import React, { useEffect, useState } from 'react';
import '../style/EmergencyFundPage.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; 
import Loader from '../components/Loader.jsx';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import { Progress } from 'react-sweet-progress'; // Use sweet progress for a nicer look

function EmergencyFundPage() {
  const [user, setUser] = useState(null);
  const [completionScore, setCompletionScore] = useState(0); 
  const navigate = useNavigate();
  const [investedData, setInvestedData] = useState(null);
  
  useEffect(() => {
    document.title = 'PlanAhead - Emergency Fund';
    return () => {
      document.title = 'PlanAhead';
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await api.get('/api/users/get-user', {
          headers: {
            Authorization: token,
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  if (!user) return <div><Loader /></div>;

  // Corrected logic to calculate emergency fund progress
  let emergencyFundTarget;
  if (user.monthsalary < 20000) {
    emergencyFundTarget = user.needs.total * 3;
  } else if (user.monthsalary < 150000) {
    emergencyFundTarget = user.needs.total * 6;
  } else if (user.monthsalary < 300000) {
    emergencyFundTarget = user.needs.total * 9;
  } else {
    emergencyFundTarget = user.needs.total * 12;
  }

  const emergencyFundProgress = calculateProgress(
    user.totalsavings.emergencyFund, 
    emergencyFundTarget
  );

  return (
    <div className="emergency-fund-page">
      <header className="header">
        <h1>Welcome back, {user.name}! </h1>
        <p>You're doing great with you financial goals!</p>
      </header>

      <section className="fund-summary">
        <div className="card">
          <h3>Emergency Fund</h3>
          <p>{formatCurrency(user.totalsavings.emergencyFund)} saved</p>
          <Progress 
            percent={emergencyFundProgress} 
            status={emergencyFundProgress >= 100 ? 'success' : 'normal'}
            theme={{ success: { symbol: '✔️', color: '#4caf50' }, normal: { symbol: '❌', color: '#fb4b04' } }} 
          />
        </div>

        <div className="card">
          <h3>Monthly Needs</h3>
          <p>{formatCurrency(user.needs.total)} spent</p>
          <span className={`budget-status ${user.needs.overUnderBudget.toLowerCase()}`}>
            {user.needs.overUnderBudget}
          </span>
        </div>
        <div className="card">
          <h3>Investment Portfolio</h3>
          <p>{formatCurrency(user.investments.totalInvestment)} invested</p>
          <ShowChartRoundedIcon className="investment-icon" />
        </div>
      </section>

      <section className="personalized-advice">
        <h2>Personalized Financial Advice</h2>
        <p>Hey, {user.name}, based on your current emergency fund situation, here’s what we suggest:</p>
        {user.totalsavings.emergencyFund < emergencyFundTarget ? (
          <div className="advice-message">
            <p><strong>Action Required:</strong> Try to increase your emergency fund to cover at least 3 months' expenses.</p>
            <p>Consider reducing non-essential expenses like dining out and clothing to save more.</p>
          </div>
        ) : (
          <div className="advice-message">
            <p><strong>Well done!</strong> You have enough emergency savings. Keep up the great work!</p>
            <p>Consider investing more in diversified portfolios to grow your wealth faster.</p>
          </div>
        )}
      </section>

      <section className="financial-tips">
        <h2>More Financial Tips for You</h2>
        <ul>
          <li>Maintain at least 3-6 months' worth of expenses in your emergency fund.</li>
          <li>Consider diversifying investments to ensure growth while safeguarding against inflation.</li>
          <li>Track your expenses regularly to avoid overspending on non-essential items.</li>
        </ul>
      </section>
    </div>
  );
}

export default EmergencyFundPage;
