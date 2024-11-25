import React, { useEffect, useState } from 'react';
import '../style/Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Ensure your API instance is correctly imported
import Loader from '../components/Loader.jsx';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
function Profile() {
  const [user, setUser] = useState(null);
  const [completionScore, setCompletionScore] = useState(0); // Fixed the state name
  const navigate = useNavigate();
  const [investedData, setInvestedData] = useState(null);

  useEffect(() => {
    document.title = 'PlanAhead - Profile';
    return () => {
      document.title = 'PlanAhead';
    };
  }, []);
  // Fetch user data from backend
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

    const fetchInvestedData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await api.get('/api/users/get-amount/invesment', {
          headers: {
            Authorization: token,
          }
        });
        setInvestedData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const calculateProfileCompletionScore = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await api.get('/api/users/calculate-profile-complection', {
          headers: {
            Authorization: token,
          }
        });
        setCompletionScore(response.data.profileCompletionPercentage); // Fixed the state update
      } catch (error) {
        console.error('Error fetching profile completion:', error);
      }
    };

    fetchInvestedData();
    calculateProfileCompletionScore();
    fetchUserData();
  }, []);

  function getColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
  }

  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    window.location.reload();
    navigate('/login');
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  // Display a loading message until the user data is fetched
  if (!user) return <div><Loader /></div>;

  return (
    <div className="profile-container">
      <div className='profile-header-box'>
        <div className='profile-user-container345'>
          <Link to='/profile-detail' className='user-dp-cointainer55'>
            <div className='user-textdp777' style={{ backgroundColor: getColor(user.name) }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className='per-user-profile-cointiner67'>{completionScore}%</span>
          </Link>
          <div className='user-data-info-cointiner852'>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{formatCurrency(user.monthsalary)}</p>
          </div>
        </div>

        {completionScore < 90 && (
  <Link to='/financial-plan' className='profile-pop-complet88'>
    <img src='assets/complet-profile.svg' alt="Complete profile" />
    <div className='profile-pop-text-745'>
      <h2>Complete your profile</h2>
      <p>Personalize your Stable Money experience</p>
    </div>
  </Link>
)}

        

      </div>

      {/* Stuff box section */}
      <div className='stuff-box'>
        {/* Left container for links */}
        <div className='stuff-box-leftcontainer'>
          <Link to='/my-investments' className='stuff-box-cointiner88'>
            <img src='assets/my-invesments.svg' alt="My Investments" />
            <div className='stuff-box-info-ox97'>
              <p>My Investments</p>
              <span>
                <h3>{formatCurrency(investedData.totalInvestment)}</h3>
                {
  investedData.totalIncrease > 0 ? (
    <strong style={{ color: '#01bd4c' }}>
      {formatCurrency(investedData.totalIncrease)} <ShowChartRoundedIcon />
    </strong>
  ) : (
    <strong style={{ color: '#bd0101' }}>
      {formatCurrency(investedData.totalIncrease)} <ShowChartRoundedIcon />
    </strong>
  )
}

              </span>
            </div>
          </Link>

          <Link to='/my-emergency-fund' className='stuff-box-cointiner88'>
            <img src='assets/Emergency_Fund.svg' alt="Emergency Fund" />
            <div className='stuff-box-info-ox97'>
              <p>My Emergency Fund</p>
              <span>
                <h4>₹{new Intl.NumberFormat('en-IN').format(user.totalsavings.bank)}</h4>
              </span>
            </div>
          </Link>

          <Link to='/credit-cards' className='stuff-box-cointiner88'>
            <img src='assets/credit-card.svg' alt="Credit For You" />
            <div className='stuff-box-info-ox97'>
              <p>Credit For You</p>
              <span>
                <h6>Flipkart Axis Bank | SBI Cash Back | IndianOil RBL Bank XTRA</h6>
              </span>
            </div>
          </Link>
        </div>

        {/* Right container for other links */}
        <div className='stuff-box-rightcontainer'>
          <Link to='/talk-to-our-expert' className='stuff-box-cointiner88'>
            <img src='assets/talk-to-expert.svg' alt="Talk to our expert" />
            <div className='stuff-box-info-ox97'>
              <p>Talk to our expert</p>
              <span>
                <h5 style={{ color: "gray", fontWeight: "600" }}>Need help on your FD booking?</h5>
              </span>
            </div>
          </Link>

          <Link to='/invite-your-loved-ones' className='stuff-box-cointiner88'>
            <img src='assets/invite-loved-ones.svg' alt="Invite your loved ones" />
            <div className='stuff-box-info-ox97'>
              <p>Invite your loved ones</p>
              <span>
                <h5 style={{ color: "gray", fontWeight: "600" }}>Claim your exclusive iPhone 16</h5>
              </span>
            </div>
          </Link>

          <Link to='/support-faq' className='stuff-box-cointiner88'>
            <img src='assets/support-faq.svg' alt="Support & FAQs" />
            <div className='stuff-box-info-ox97'>
              <p>Support & FAQs</p>
              <span>
                <h5 style={{ color: "gray", fontWeight: "600" }}>Rest assured, we are available 24 x 7</h5>
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Logout button */}
      <div className='log-out-cointainer645'>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
