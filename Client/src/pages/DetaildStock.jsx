import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/DetaildStock.css';
import api from '../api';
import Loader from '../components/Loader.jsx';
import ShareIcon from '@mui/icons-material/Share';
import myPic from '../assets/error_png.png';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AlertComponent from '../components/AlertComponent.jsx'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function DetaildStock() {
  const { nseScriptCode } = useParams();
  const [stockDetails, setStockDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await api.get(`/api/users/stocks/detail/${nseScriptCode}`);
        setStockDetails(response.data);
        setLoading(false);
      } catch (err) {
        handleAlert('error', 'Error fetching stock details, Please try again.');
        setLoading(false);
      }
    };

    if (nseScriptCode) fetchStockDetails();
  }, [nseScriptCode]);

  const handleShareClick = () => {
    const shareData = {
      title: stockDetails?.company?.companyName || '',
      text: `Check out this stock: ${stockDetails?.company?.companyName || ''}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) =>handleAlert('info', `Error sharing: ${error}`));
    } else {
      handleAlert('info', 'Share feature is not supported on your browser.');
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  if (error) return <p>{error}</p>;
  if (loading) return <Loader />;

  const renderMiniChart = (dataPoints, color, label) => ({
    labels: ['High', 'Low'],
    datasets: [
      {
        label,
        data: dataPoints,
        borderColor: color,
        backgroundColor: `${color}33`,
        tension: 0,
        fill: true,
      },
    ],
  });

  return (
    <div className="DetailedStock">
            {alert && <AlertComponent severity={alert.severity} message={alert.message} />}
      {stockDetails ? (
        <div className="stock-details">
          <div className="stock-image-sair-coi292">
            <img
              src={stockDetails.company.imageUrl}
              alt={stockDetails.company.searchId}
              className="stock-image"
            />
            <ShareIcon
              onClick={handleShareClick}
              style={{ cursor: 'pointer', fontSize: '36px' }}
            />
          </div>

          <div className="stock-main-name-label41650">
            <h2>{stockDetails.company.companyName}</h2>
          </div>

          <div className="stock-main-price-8282828">
            <h2>{formatCurrency(stockDetails.stats.ltp)}</h2>
          </div>

          <div className="stock-incidec-289">
            <p>{stockDetails.stats.dayChange.toFixed(2)}</p>
            <p>{`(${stockDetails.stats.dayChangePerc.toFixed(2)}%)`}</p>
            <p className="da24662">1D</p>
            </div>

          <div className="stock-index-canvs-789">
            <Line
              data={{
                labels: ['Open', 'High', 'Low', 'Close'],
                datasets: [
                  {
                    label: 'Stock Price',
                    data: [
                      stockDetails.stats.open,
                      stockDetails.stats.high,
                      stockDetails.stats.low,
                      stockDetails.stats.close,
                    ],
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    tension: 0.4,
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>

          <div className="stock-Performance-coaintainer">
            <div className="stockperfomc-today-high-low">
              <span>
                <p>Today's High</p>
                <h3>{stockDetails.stats.high}</h3>
                </span>

                <div style={{ width: '100px', height: '50px' }}>
                  <Line
                    data={renderMiniChart(
                      [stockDetails.stats.high, stockDetails.stats.low],
                      'rgba(255, 99, 132, 1)',
                      "Today's Low"
                    )}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { display: false }, y: { display: false } },
                    }}
                  />
                </div>
                <span>
                <p>Today's Low</p>
                <h3>{stockDetails.stats.low}</h3>
              </span>
            </div>

            <div className="stockperfomc-last-high-low-25">
              <span>
                <p>53 Week's High</p>
                <h3>{stockDetails.stats.highPriceRange}</h3>
                </span>

                <div style={{ width: '100px', height: '50px' }}>
                  <Line
                    data={renderMiniChart(
                      [stockDetails.stats.lowPriceRange, stockDetails.stats.highPriceRange],
                      'rgba(75, 192, 192, 1)',
                      "53 Week's High"
                    )}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { display: false }, y: { display: false } },
                    }}
                  />
                </div>
                <span>
                <p>53 Week's Low</p>
                <h3>{stockDetails.stats.lowPriceRange}</h3>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className='not-stock-found'>
  <img src={myPic} alt="No stock found" />
        </div>
      )}
    </div>
  );
}

export default DetaildStock;
