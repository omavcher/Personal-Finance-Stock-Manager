import axios from 'axios';

const api = axios.create({
  baseURL:'https://personal-finance-stock-manager.onrender.com', 
});

export default api;
