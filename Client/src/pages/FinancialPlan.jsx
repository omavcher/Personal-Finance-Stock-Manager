import React, { useState, useEffect } from "react";
import api from '../api.js';
import '../style/FinancialPlan.css';
import Button from '@mui/material/Button';
import Loader from '../components/Loader.jsx';
import AlertComponent from '../components/AlertComponent.jsx'; 
function FinancialPlan() {
  const [alert, setAlert] = useState(null);

  const handleAlert = (type, message) => {
    setAlert({ severity: type, message });
  };

  const [user, setUser] = useState(null);
  const [needbugetsi, setNeedbugetsi] = useState(null);
  const [wantsbugetsi, setWantbugetsi] = useState(null);
  const [allneed, setAllNeed] = useState(50);
  const [allwants, setAllWants] = useState(30);
  const [allinvest, setAllInvest] = useState(20);
  const [bullupdateOnInput, setBullupdateOnInput] = useState(false);
  const [aemergencyFund, setEmergencyFund] = useState(0);
  const [needemergencyFund, setNeedEmergencyFund] = useState(0);
  const [calculatedBudget, setCalculatedBudget] = useState({
    needs: 0,
    wants: 0,
    investments: 0
  });

  const [formData, setFormData] = useState({
    monthsalary: 0
  });

  const [userExpenses, setUserExpenses] = useState({
    rent: 0,
    food: 0,
    electricity: 0,
    mobile: 0,
    clothes: 0,
    transport: 0,
    internet: 0,
    carBikeEMI: 0,
    phoneEMI: 0,
    vacation: 0,
    exclothes: 0,
    diningOut: 0
  });

  const [userInvestments, setUserInvestments] = useState({
    nifty50: {
      allocation: null,
      startingAmount: null,
      returns: null
    },
    midCap: {
      allocation: null,
      startingAmount: null,
      returns: null
    },
    smallCap: {
      allocation: null,
      startingAmount: null,
      returns: null
    }
  });

  const [totalofall, setTotalofall] = useState({
    totalneeds: 0,
    totalwants: 0,
    totalinvestments: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const token = localStorage.getItem('Authorization');
        const response = await api.get('/api/users/get-user', { headers: { Authorization: token } });
        if (response.data) {
          const responseuser = response.data;
          setFormData({monthsalary:responseuser.monthsalary || 0})
          setUserExpenses({
            rent: responseuser.needs.rent,
            food: responseuser.needs.food,
            electricity: responseuser.needs.electricity,
            mobile: responseuser.needs.mobile,
            clothes: responseuser.needs.clothes,
            transport: responseuser.needs.transport,
            internet: responseuser.needs.internet,
            carBikeEMI: responseuser.wants.carBike,
            phoneEMI: responseuser.wants.phone,
            vacation: responseuser.wants.vacation,
            exclothes: responseuser.wants.clothes,
            diningOut: responseuser.wants.diningOut
          });
          setTotalofall({
            totalneeds: responseuser.needs.total,
            totalwants: responseuser.wants.total,
            totalinvestments: responseuser.investments.totalInvestment
          });
          setUserInvestments({
            nifty50: {
              allocation: responseuser.investments.nifty50.allocation,
              startingAmount: responseuser.investments.nifty50.startingAmount,
              returns: responseuser.investments.nifty50.returns
            },
            midCap: {
              allocation: responseuser.investments.midCap.allocation,
              startingAmount: responseuser.investments.midCap.startingAmount,
              returns: responseuser.investments.midCap.returns
            },
            smallCap: {
              allocation: responseuser.investments.smallCap.allocation,
              startingAmount: responseuser.investments.smallCap.startingAmount,
              returns: responseuser.investments.smallCap.returns
            }
          });
          setNeedbugetsi(responseuser.needs.overUnderBudget);
          setWantbugetsi(responseuser.wants.overUnderBudget);
          setEmergencyFund(responseuser.totalsavings.emergencyFund);
          setUser(response.data);
          calculateBudget(responseuser.monthsalary|| 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const calculateTotalofAll = () => {
      // Calculate total needs
      const totaltheneed =
        userExpenses.rent +
        userExpenses.food +
        userExpenses.electricity +
        userExpenses.mobile +
        userExpenses.clothes +
        userExpenses.transport +
        userExpenses.internet;

      // Calculate total wants
      const totalthewant =
        userExpenses.carBikeEMI +
        userExpenses.phoneEMI +
        userExpenses.vacation +
        userExpenses.exclothes +
        userExpenses.diningOut;

      // Calculate total investments, including returns
      const totalInvestments = Object.values(userInvestments).reduce((total, investment) => {
        const startingAmount = investment.startingAmount || 0;
        const allocation = investment.allocation || 0;
        const returns = investment.returns || 0; // Return percentage
        return total + (startingAmount * (allocation / 100)) * (1 + returns / 100);
      }, 0);

      // Update the total state
      setTotalofall({
        totalneeds: totaltheneed,
        totalwants: totalthewant,
        totalinvestments: totalInvestments,
      });
    };

    let emergencyFundAmount = 0;
    if (formData.monthsalary < 20000) {
      emergencyFundAmount = formData.monthsalary * 3;
    } else if (formData.monthsalary < 150000) {
      emergencyFundAmount = formData.monthsalary * 6;
    }else if (formData.monthsalary < 300000) {
      emergencyFundAmount = formData.monthsalary * 9;
    } else {
      emergencyFundAmount = formData.monthsalary * 12;
    }
    setNeedEmergencyFund(emergencyFundAmount);

    calculateTotalofAll();
  }, [userExpenses, userInvestments, formData.monthsalary]); // This effect runs whenever userExpenses, userInvestments, or salary changes

  const calculateBudget = (salary) => {
    let needs, wants, investments;
    if (salary < 30000) {
      needs = salary * 0.50;
      wants = salary * 0.30;
      investments = salary * 0.20;
      setAllNeed(50); setAllWants(30); setAllInvest(20);
    } else if (salary > 150000) {
      needs = salary * 0.37;
      wants = salary * 0.32;
      investments = salary * 0.30;
      setAllNeed(37); setAllWants(32); setAllInvest(30);
    } else {
      needs = salary * 0.34;
      wants = salary * 0.33;
      investments = salary * 0.32;
      setAllNeed(34); setAllWants(33); setAllInvest(32);
    }

    setCalculatedBudget({
      needs,
      wants,
      investments
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle userExpenses updates
    if (Object.keys(userExpenses).includes(name)) {
      const numericValue = parseInt(value.replace(/[^0-9.-]+/g, ""), 10);
      if (!isNaN(numericValue)) {
        setUserExpenses((prevExpenses) => ({
          ...prevExpenses,
          [name]: numericValue
        }));
      } else {
        console.error("Invalid value entered, not a valid number");
      }
    }

    // Handle userInvestments updates
    if (name.includes("_")) {
      const [key, field] = name.split("_");

      if (Object.keys(userInvestments).includes(key)) {
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""), 10);
        if (!isNaN(numericValue)) {
          setUserInvestments((prevInvestments) => ({
            ...prevInvestments,
            [key]: {
              ...prevInvestments[key],
              [field]: numericValue
            }
          }));
        } else {
          console.error("Invalid value entered, not a valid number");
        }
      }
    }

    if (name === "monthsalary") {
    setFormData((prevFormData) => ({
      ...prevFormData,
      monthsalary: value,
    }));
    // Recalculate budget whenever salary changes
    calculateBudget(value);
  }
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    let Budgetwant, Budgetneed;

    if (calculatedBudget.wants > totalofall.totalwants) {
        Budgetwant = 'Under';
    } else {
        Budgetwant = 'Over';
    }

    if (calculatedBudget.needs > totalofall.totalneeds) {
        Budgetneed = 'Under';
    } else {
        Budgetneed = 'Over';
    }

    // Calculate overall averageReturns
    const avgReturn = (
        userInvestments.midCap.returns +
        userInvestments.nifty50.returns +
        userInvestments.smallCap.returns
    ) / 3;

    try {
        const userData = {
            totalsavings: {
                emergencyFund: aemergencyFund
            },
            needs: {
                rent: userExpenses.rent,
                food: userExpenses.food,
                electricity: userExpenses.electricity,
                mobile: userExpenses.mobile,
                clothes: userExpenses.clothes,
                transport: userExpenses.transport,
                internet: userExpenses.internet,
                total: totalofall.totalneeds,
                overUnderBudget: Budgetneed
            },
            wants: {
                carBike: userExpenses.carBikeEMI,
                phone: userExpenses.phoneEMI,
                vacation: userExpenses.vacation,
                clothes: userExpenses.exclothes,
                diningOut: userExpenses.diningOut,
                total: totalofall.totalwants,
                overUnderBudget: Budgetwant
            },
            investments: {
                nifty50: {
                    allocation: userInvestments.nifty50.allocation,
                    startingAmount: userInvestments.nifty50.startingAmount,
                    returns: userInvestments.nifty50.returns
                },
                midCap: {
                    allocation: userInvestments.midCap.allocation,
                    startingAmount: userInvestments.midCap.startingAmount,
                    returns: userInvestments.midCap.returns
                },
                smallCap: {
                    allocation: userInvestments.smallCap.allocation,
                    startingAmount: userInvestments.smallCap.startingAmount,
                    returns: userInvestments.smallCap.returns
                },
                totalInvestment: totalofall.totalinvestments,
                averageReturns: avgReturn
            },
            anumsalary: formData.monthsalary * 12,
            monthsalary:formData.monthsalary
        };

        const token = localStorage.getItem('Authorization');
        const response = await api.post('/api/users/save-user/remaininfo', userData, {
            headers: { Authorization: token }
        });

        if (response.data) {
            handleAlert('success', 'Your financial data has been saved successfully!');
        } else {
            handleAlert('error', 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        handleAlert('error', 'Error submitting the form. Please try again.');
    }
};


const updateOnInput = () => {
    setBullupdateOnInput(true);
    handleAlert('info', 'Now you can update your salary');
};


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (!user) return <div><Loader /></div>;

  return (
    <div className="Financial-container555">  
      {alert && <AlertComponent severity={alert.severity} message={alert.message} />}

      <div className="sign-up-box359">
        <h2>Your Financial Plan</h2>
        <p>Organize and manage your financial data efficiently</p>
        <form onSubmit={handleSubmit}>
          <div className="input-groupfinanc888">
            <label>Monthly Salary</label>
            <input
              className="input-groupfinancsalaryin"
              type="number"
              name="monthsalary"
              value={formData.monthsalary}
              onChange={handleChange}
              disabled={bullupdateOnInput === false}
            />
            <button type="button" onClick={updateOnInput} className="update-salary-btn-852">Update Salary</button>
          </div>

          <div className="buget-inpiff88">
            <div className="input-groupfinanc888">
              <label>Max Budget for Needs ({allneed}%)</label>
              <input type="text" value={formatCurrency(calculatedBudget.needs)} disabled />
            </div>
            <div className="input-groupfinanc888">
              <label>Max Budget for Wants ({allwants}%)</label>
              <input type="text" value={formatCurrency(calculatedBudget.wants)} disabled />
            </div>
            <div className="input-groupfinanc888">
              <label>Max Budget for Investments ({allinvest}%)</label>
              <input type="text" value={formatCurrency(calculatedBudget.investments)} disabled />
            </div>
          </div>

          <div className="input-groupfinanc888">
              <label>Emergency Fund Allocation - ({formatCurrency(needemergencyFund)})</label>
              <input   onChange={(e) => setEmergencyFund(parseFloat(e.target.value.replace(/[^0-9.-]+/g, "")) || 0)}
  style={{border: '1px solid #ff0000'}} type="text" value={formatCurrency(aemergencyFund)} />
            </div>

           
          <div className="need-cointainer-658">
            <h3>Need's</h3>
            <div className="input-need0-coin78">
              {/* Need section inputs */}
              {Object.keys(userExpenses).slice(0, 7).map((key, index) => (
                <div key={index} className="input-groupfinanc888">
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="text"
                    name={key}
                    value={formatCurrency(userExpenses[key])}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="input-groupfinanc888">
            <label
  style={{
    color: needbugetsi === 'Under' ? 'green' : needbugetsi === 'Over' ? 'red' : needbugetsi === 'none' ? 'black' : 'inherit',
    display: needbugetsi === 0 ? 'none' : 'inline',
  }}
>
  {needbugetsi === 'none' ? 'Total Needs of you' : `Total needs of you (budget status is ${needbugetsi})`}
</label>

              <input type="text" value={formatCurrency(totalofall.totalneeds)} disabled/>
            </div>
          </div>

          <div className="need-cointainer-658">
            <h3>Want's</h3>
            <div className="input-need0-coin78">
              {/* Want section inputs */}
              {Object.keys(userExpenses).slice(7).map((key, index) => (
                <div key={index} className="input-groupfinanc888">
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="text"
                    name={key}
                    value={formatCurrency(userExpenses[key])}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="input-groupfinanc888">
              <label
  style={{
    color: wantsbugetsi === 'Under' ? 'green' : wantsbugetsi === 'Over' ? 'red' : 'inherit',
    display: wantsbugetsi === 0 ? 'none' : 'inline',
  }}
>
  Total Wants of you (budget status is {wantsbugetsi})
</label>

              <input type="text" value={formatCurrency(totalofall.totalwants)} disabled/>
            </div>
          </div>

      

          <div className="need-cointainer-658">
  <h3>Investment's</h3>
  <div className="input-need0-coin78">
    {Object.keys(userInvestments).map((key, index) => (
      <div key={index} className="input-groupfinanc888">
        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <input
          type="number"
          name={`${key}_allocation`} // e.g. "nifty50_allocation"
          value={userInvestments[key].allocation || ''}
          onChange={handleChange}
          placeholder={`Allocation (%)`}
        />
        <input
          type="number"
          name={`${key}_startingAmount`} // e.g. "nifty50_startingAmount"
          value={userInvestments[key].startingAmount || ''}
          onChange={handleChange}
          placeholder="Amount"
        />
        <input
          type="number"
          name={`${key}_returns`} // e.g. "nifty50_returns"
          value={userInvestments[key].returns || ''}
          onChange={handleChange}
          placeholder="Expected Returns (%)"
        />
      </div>
    ))}
  </div>
  <div className="input-groupfinanc888">
    <label>Total Investments of you</label>
    <input type="text" value={formatCurrency(totalofall.totalinvestments)} disabled />
  </div>
</div>


<button className="savefinal-plan-8989" type="submit" variant="contained" color="primary">Save Financial Plan</button>
</form>
      </div>
    </div>
  );
}

export default FinancialPlan;
