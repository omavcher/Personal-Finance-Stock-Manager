import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Investments from './pages/Investments';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import SignUp from './pages/SignUp';
import ProfileDetail from './pages/ProfileDetail';
import Loader from './components/Loader';
import FinancialPlan from './pages/FinancialPlan';
import EmergencyFundPage from './pages/EmergencyFundPage'
import CreditCardPage from './pages/CreditCardPage';
import TalkToExpertPage from './pages/TalkToExpertPage';
import InvitePage from './pages/InviteYourLovedOnes';
import SupportFAQs from './pages/SupportFAQs';
import FdsPage from './pages/FdsPage';
import Footer from './components/Footer';
import Header from './components/Header';
import StocksPage from './pages/StocksPage';
import DetaildStock from './pages/DetaildStock';

function App() {
  return (
    <Router>
      <Header/>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile-detail" element={<ProfileDetail />} />
          <Route path="/financial-plan" element={<FinancialPlan />} />
          <Route path="/my-investments" element={<Investments />} />
          <Route path="/my-emergency-fund" element={<EmergencyFundPage />} />
          <Route path="/credit-cards" element={<CreditCardPage />} />
          <Route path="/talk-to-our-expert" element={<TalkToExpertPage />} />
          <Route path="/invite-your-loved-ones" element={<InvitePage />} />
          <Route path="/support-faq" element={<SupportFAQs />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/stock/:nseScriptCode" element={<DetaildStock />} />
          <Route path="/fds" element={<FdsPage />} />


        </Routes>
      </div>
       {/* <Footer/> */}
    </Router>
  );
}

export default App;
