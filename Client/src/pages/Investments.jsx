import React, { useEffect, useState } from 'react';
import api from '../api'; // Assuming you have set up your API instance correctly
import '../style/Investments.css';
import Loader from '../components/Loader.jsx';
import createTransitions from '@mui/material/styles/createTransitions.js';
import AlertComponent from '../components/AlertComponent.jsx'; 
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Investments = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [invest, setInvest] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };

  useEffect(() => {
    document.title = 'PlanAhead - My Investments';
    return () => {
      document.title = 'PlanAhead';
    };
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockSymbols = ['SWIGGY', 'ADANIPOWER', 'ZOMATO', 'ABB', 'HDFC', 'LICI', 'SBIN', 'TATAPOWER', 'JIOFIN'];
        const stockData = await Promise.all(
          stockSymbols.map(async (symbol) => {
            const response = await api.get(`/api/users/stocks/${symbol}`);
            return { symbol, data: response.data };  
          })
        );
        setStocks(stockData);  
        setLoading(false);
      } catch (error) {
        handleAlert('error', 'Error in retrieving stock reports, Please try again.');
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await api.get('/api/invest/invest-imp-info', {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data);
        setInvest(response.data);
      } catch (error) {
        handleAlert('error', 'Error, Please try again.');
      }
    };

    fetchUserData();
    fetchStockData();
  }, []);

  // Handle stock card selection
  const handleStockSelect = (symbol) => {
    const stock = stocks.find((stock) => stock.symbol === symbol);
    setSelectedStock(stock); // Set the selected stock's data to display in the table
  };

  const prepareTableRows = (stockData) => {
    if (!stockData || !stockData.data) {
      console.error('No data available for stock:', stockData.symbol);
      return [];
    }
  
    let rows = [];
  
    // Check if stockData.data is an array or an object and handle accordingly
    if (Array.isArray(stockData.data)) {
      // If it's an array, use .map()
      rows = stockData.data.map((entry, index) => (
        <tr key={index}>
          <td>{new Date(entry.tsInMillis).toLocaleTimeString()}</td>
          <td>{entry.open}</td>
          <td>{entry.high}</td>
          <td>{entry.low}</td>
          <td>{entry.close}</td>
        </tr>
      ));
    } else {
      // If it's an object, extract the values directly
      console.log('Data is an object:', stockData.data);
      rows.push(
        <tr key="singleEntry">
          <td>{new Date(stockData.data.tsInMillis).toLocaleTimeString()}</td>
          <td>{stockData.data.open}</td>
          <td>{stockData.data.high}</td>
          <td>{stockData.data.low}</td>
          <td>{stockData.data.close}</td>
        </tr>
      );
    }
  
    return rows;
  };
  


  const chartData = {
    labels: ['Nifty50', 'MidCap', 'SmallCap'],
    datasets: [
      {
        label: 'Returns (%)',
        data: [
          invest?.nifty50.returns,
          invest?.midCap.returns,
          invest?.smallCap.returns
        ],
        borderColor: '#1E8057',
        backgroundColor: '#bff8e0',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Investment Return Comparison'
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `${value}%`, // Format Y-axis values as percentages
        },
      },
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!invest) return <div><Loader /></div>;
  
  return (
    <div className="investments-page-986">
                  {alert && <AlertComponent severity={alert.severity} message={alert.message} />}

      <h1>Stock Investments</h1>

      <div className='investment-user-data-65'>
        <h2>User Details</h2>
          <>
          <div className='user-invest443'>
            <p><strong>Total Investment:</strong> {formatCurrency(invest.totalInvestment.toFixed(2))}</p>
            <p><strong>Avg Returns:</strong> {invest.averageReturns.toFixed(2)}%</p>
</div>
            <div className="investment-user-data-container">
              <div className="investment-data-item">
                <h4>Nifty50</h4>
                <p><strong>Allocation:</strong> {invest.nifty50.allocation}%</p>
                <p><strong>Starting Amount:</strong> {formatCurrency(invest.nifty50.startingAmount)}</p>
                <p><strong>Returns:</strong> {invest.nifty50.returns}%</p>
              </div>

              <div className="investment-data-item">
                <h4>MidCap</h4>
                <p><strong>Allocation:</strong> {invest.midCap.allocation}%</p>
                <p><strong>Starting Amount:</strong> {formatCurrency(invest.midCap.startingAmount)}</p>
                <p><strong>Returns:</strong> {invest.midCap.returns}%</p>
              </div>

              <div className="investment-data-item">
                <h4>SmallCap</h4>
                <p><strong>Allocation:</strong> {invest.smallCap.allocation}%</p>
                <p><strong>Starting Amount:</strong> {formatCurrency(invest.smallCap.startingAmount)}</p>
                <p><strong>Returns:</strong> {invest.smallCap.returns}%</p>
              </div>
            </div>

            <div className="investment-chart">
              <h3>Returns Comparison</h3>
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
      </div>
      <br/><br/>
      <br/>
      <h2>Top Stocks</h2>
      <div className="stock-selection-562">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className={`stock-card-98 ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => handleStockSelect(stock.symbol)}
          >
            <img src={`src/assets/listed-comp-logo/${stock.symbol}.svg`} alt='' />
            <h3>{stock.symbol}</h3>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : selectedStock ? (
        <div className="stock-details-500">
          <h2>{selectedStock.symbol} - Stock Details</h2>
          <div className="table-wrapper">
            <table className="stock-table-inv56">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Open Price</th>
                  <th>High Price</th>
                  <th>Low Price</th>
                  <th>Close Price</th>
                </tr>
              </thead>
              <tbody>{prepareTableRows(selectedStock)}</tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Please select a stock to view its details.</p>
      )}
    </div>
  );
};

export default Investments;
