import React, { useState, useEffect } from 'react';
import '../style/Stocks.css'; // Ensure this file has necessary styles
import AlertComponent from '../components/AlertComponent.jsx'; // Component for displaying alerts
import api from '../api.js';
import { Link } from 'react-router-dom';  // Import Link for navigation
import Loader from '../components/Loader.jsx'

const StocksPage = () => {
  const [stocks, setStocks] = useState([]); // State for storing stock data
  const [loading, setLoading] = useState(true); // State for loading status
  const [alert, setAlert] = useState(null); // State for alerts

  const handleAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000); 
  };
  useEffect(() => {
    document.title = 'PlanAhead - Stocks';
    return () => {
      document.title = 'PlanAhead';
    };
  }, []);
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await api.get('/api/users/top/stocks'); 
        console.log('API Response:', response.data); // Debugging
        setStocks(response.data || []); // Set stock data if available
      } catch (error) {
        handleAlert('error', 'Failed to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []); // Empty dependency array to run on component mount


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <Loader/>; // Optional loading state
  }


  return (
    <div className="stock-grid-container">
     
      
      {alert && <AlertComponent type={alert.type} message={alert.message} />}
      
      {stocks.STOCKS_IN_NEWS && stocks.STOCKS_IN_NEWS.length > 0 && (
      <section className='stocks-kk15'>
      <h2 className="section-title">Stocks in News</h2>
      <div className="stock-grid">
        {stocks.STOCKS_IN_NEWS.map((stock, index) => (
           <Link 
           to={`/stock/${stock.company.nseScriptCode}`}  // Route to the stock details page
           key={index}
           className="stock-card" // Make the whole card clickable
         >
            <img src={stock.company.imageUrl} alt={`${stock.company.companyName} logo`} className="stock-logo" />
            <div className="stock-info">
            <h3 className="stock-name">
  {stock.company.companyName.length > 10 
    ? stock.company.companyName.substring(0, 13) + "..." 
    : stock.company.companyName}
</h3>
                <div>
                  <p className="stock-price">{formatCurrency(stock.stats.ltp)}</p>

<p className={`stock-change ${stock.stats.dayChangePerc > 0 ? 'positive' : ''}`}>
  {stock.stats.dayChangePerc.toFixed(2)}
</p>          </div>

            </div>
          </Link>
        ))}
      </div>
      </section>
      )}

      {stocks.TOP_GAINERS && stocks.TOP_GAINERS.length > 0 && (
      <section className='stocks-kk15'>
      <h2 className="section-title">Top Gainers</h2>
      <div className="stock-grid">
        {stocks.TOP_GAINERS.map((stock, index) => (
          <Link 
          to={`/stock/${stock.company.nseScriptCode}`}  // Route to the stock details page
          key={index}
          className="stock-card" // Make the whole card clickable
        >
            <img src={stock.company.imageUrl} alt={`${stock.company.companyName} logo`} className="stock-logo" />
            <div className="stock-info">
            <h3 className="stock-name">
  {stock.company.companyName.length > 10 
    ? stock.company.companyName.substring(0, 13) + "..." 
    : stock.company.companyName}
</h3>     
                <div>
                  <p className="stock-price">{formatCurrency(stock.stats.ltp)}</p>
                  
                   <p className={`stock-change ${stock.stats.dayChangePerc > 0 ? 'positive' : ''}`}>
  {stock.stats.dayChangePerc.toFixed(2)}
</p>
                         </div>
            </div>
          </Link>
        ))}
      </div>
      </section>
      )}

      {stocks.TOP_LOSERS && stocks.TOP_LOSERS.length > 0 && (
      <section className='stocks-kk15'>
      <h2 className="section-title">Top Losers</h2>
      <div className="stock-grid">
        {stocks.TOP_LOSERS.map((stock, index) => (
          <Link 
          to={`/stock/${stock.company.nseScriptCode}`}  // Route to the stock details page
          key={index}
          className="stock-card" // Make the whole card clickable
        >
            <img src={stock.company.imageUrl} alt={`${stock.company.companyName} logo`} className="stock-logo" />
            <div className="stock-info">
            <h3 className="stock-name">
  {stock.company.companyName.length > 10 
    ? stock.company.companyName.substring(0, 13) + "..." 
    : stock.company.companyName}
</h3>     
                <div>
                  <p className="stock-price">{formatCurrency(stock.stats.ltp)}</p>
                 <p className={`stock-change ${stock.stats.dayChangePerc > 0 ? 'positive' : ''}`}>
  {stock.stats.dayChangePerc.toFixed(2)}
</p>
             </div>

            </div>
          </Link>
        ))}
      </div>
      </section>
      )}


      {stocks.MOST_VALUABLE && stocks.MOST_VALUABLE.length > 0 && (
  <section className='stocks-kk15'>
    <h2 className="section-title">Most Valuable</h2>
    <div className="stock-grid">
      {stocks.MOST_VALUABLE.map((stock, index) => (
        <Link 
          to={`/stock/${stock.company.nseScriptCode}`}  // Route to the stock details page
          key={index}
          className="stock-card" // Make the whole card clickable
        >
          <img 
            src={stock.company.imageUrl} 
            alt={`${stock.company.companyName} logo`} 
            className="stock-logo" 
          />
          <div className="stock-info">
            <h3 className="stock-name">
              {stock.company.companyName.length > 10 
                ? stock.company.companyName.substring(0, 13) + "..." 
                : stock.company.companyName}
            </h3>
            <div>
              <p className="stock-price">{formatCurrency(stock.stats.ltp)}</p>
              <p className={`stock-change ${stock.stats.dayChangePerc > 0 ? 'positive' : ''}`}>
                {stock.stats.dayChangePerc.toFixed(2)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
)}



{stocks.POPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER && stocks.POPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER.length > 0 && (
      <section className='stocks-kk15'>
      <h2 className="section-title">Popular Stocks Most Bought By Turnover</h2>
      <div className="stock-grid">
        {stocks.POPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER.map((stock, index) => (
          <Link 
          to={`/stock/${stock.company.nseScriptCode}`}  // Route to the stock details page
          key={index}
          className="stock-card" // Make the whole card clickable
        >
            <img src={stock.company.imageUrl} alt={`${stock.company.companyName} logo`} className="stock-logo" />
            <div className="stock-info">
            <h3 className="stock-name">
  {stock.company.companyName.length > 10 
    ? stock.company.companyName.substring(0, 13) + "..." 
    : stock.company.companyName}
</h3>     
                <div>
                  <p className="stock-price">{formatCurrency(stock.stats.ltp)}</p>
                 <p className={`stock-change ${stock.stats.dayChangePerc > 0 ? 'positive' : ''}`}>
  {stock.stats.dayChangePerc.toFixed(2)}
</p>
             </div>

            </div>
          </Link>
        ))}
      </div>
      </section>
)}

    </div>
  );
};

export default StocksPage;
