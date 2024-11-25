const User = require("../models/User.js");
const MonthlyFinanceSchema = require("../models/MonthlyFinanceSchema.js");
const TalkwithSchema = require("../models/TalkwithSchema.js");
const creditCardSchema = require("../models/creditCardSchema.js");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 
const nodemailer = require("nodemailer");
const crypto = require("crypto");
let otpStorage = {}; 


exports.getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust to your JWT secret or use config

    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.otp = async (req, res) => {
  const { email } = req.body; // Get the email from the request

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);
    otpStorage[email] = otp; // Store OTP for this email

    // Create a transporter for sending email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'omawchar07@gmail.com', // Your email (set in .env)
        pass: 'dxvxcsvhqidyqjwg', // Your email password or app-specific password
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for PlanAhead Sign Up",
      text: `Your OTP is: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Function to verify OTP
// Function to verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  console.log(`otp Storage - ${JSON.stringify(otpStorage)}`);
  console.log(`otp - ${otp}`);
  console.log(`email - ${email}`);
  console.log(`otpStorage[email] - ${otpStorage[email]}`);

  if (!otpStorage[email]) {
    return res.status(400).json({ message: "OTP not found for this email" });
  }

  // Convert otp from the request to a number before comparison
  if (otpStorage[email] === parseInt(otp, 10)) {
    // OTP is valid, proceed with registration or next step
    delete otpStorage[email]; // Optionally delete OTP after successful verification
    return res.status(200).json({ message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};



exports.register = async (req, res) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) {
      // If email exists, send a response indicating that the user is already registered
      return res.status(201).json({ message: 'already-registered', alreemail:req.body.email });
    }

    // If email is not found, proceed to save the new user
    const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      jobType: req.body.jobType,
      monthsalary: req.body.monthsalary,
      anumsalary: null,
      totalsavings: {
        bank: null,
        emergencyFund: null
      },
      city: null, 
  birthdate: null,
      needs: {
        rent: null,
        food: null,
        electricity: null,
        mobile: null,
        clothes: null,
        transport: null,
        internet: null,
        total: null,
        overUnderBudget: "none"
      },
      wants: {
        carBike: null,
        phone: null,
        vacation: null,
        clothes: null,
        diningOut: null,
        total: null,
        overUnderBudget: "none"
      },
      investments: {
        nifty50: { allocation: null, startingAmount: null, returns: null },
        midCap: { allocation: null, startingAmount: null, returns: null },
        smallCap: { allocation: null, startingAmount: null, returns: null },
        totalInvestment: null,
        averageReturns: null
      },
      inflationRate: 6, // Default inflation rate
      family: {
        maritalStatus: "none",
        childrenCount: null,
        childrenDetails: [],
        parentsStatus: { mother: "none", father: "none" }
      },
      lastFinancialUpdate: null,
    });

    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'successfully', user: newUser });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.LogIn = async (req, res) => {
  try {
    const { email} = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide both email.' });
    }

    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: 'Invalid email.' });
    }


    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        _id: user._id
      },
      token
    });
  } catch (err) {
    console.error('LogIn Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.CalculateProfileCompletionScore = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust to your JWT secret or use config

    const user = await User.findById(decoded.id); // Fetch the user from the database

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fields to check for profile completion (feel free to modify based on your model)
    const fields = [
      'email',
      'name',
      'age',
      'city',
      'birthdate',
      'jobType',
      'monthsalary',
      'anumsalary',
      'totalsavings.bank',
      'totalsavings.emergencyFund',
      'needs.rent',
      'needs.food',
      'needs.electricity',
      'needs.mobile',
      'needs.clothes',
      'needs.transport',
      'needs.internet',
      'wants.carBike',
      'wants.phone',
      'wants.vacation',
      'wants.clothes',
      'wants.diningOut',
      'investments.nifty50.allocation',
      'investments.midCap.allocation',
      'investments.smallCap.allocation',
      'investments.totalInvestment',
      'inflationRate',
      'family.maritalStatus',
      'family.childrenCount',
      'family.parentsStatus.mother',
      'family.parentsStatus.father'
    ];

    let filledFields = 0;
    let totalFields = fields.length;

    // Loop through each field and check if it's filled
    fields.forEach(field => {
      const value = field.split('.').reduce((obj, key) => (obj && obj[key]) || null, user);
      if (value !== null && value !== "none" && value !== undefined) {
        filledFields++;
      }
    });

    // Calculate the percentage of profile completion
    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    // Send the completion score back to the user
    res.status(200).json({ profileCompletionPercentage: completionPercentage });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.Subdetailput = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract data from request body
    const { city, maritalStatus, childrenCount, childrenDetails, parentsStatus, birthDate } = req.body;

    // Update user data with new details
    user.city = city;
    user.family.maritalStatus = maritalStatus;
    user.family.childrenCount = childrenCount;
    user.family.childrenDetails = childrenDetails;
    user.family.parentsStatus = parentsStatus;
    user.birthdate = birthDate;

    await user.save();

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.CheckUserSubInfo1 = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.birthdate !== null) {
      return res.status(200).json({ check: 'true', step: 2 });
    }else{
      return res.status(200).json({ check: 'false', step: 1 });
    }

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.SaveUserRemainInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentDate = new Date();
    const lastUpdateDate = user.lastFinancialUpdate || new Date(0); // Fallback to epoch date if never updated
    const lastUpdateMonth = lastUpdateDate.getMonth();
    const currentMonth = currentDate.getMonth();
    const lastUpdateYear = lastUpdateDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    let newDate;

    // Check if last update was in the same month and year
    if (lastUpdateMonth === currentMonth && lastUpdateYear === currentYear) {
      newDate = lastUpdateDate;
    } else {
      newDate = new Date(); // New update date for this month
    }

    // If the last update was in a different month or year, create a new MonthlyFinance entry
    if (currentMonth !== lastUpdateMonth || currentYear !== lastUpdateYear) {
      const salary = req.body.anumsalary / 12; // Assuming annual salary is provided
      const otherSources = req.body.investments.totalInvestment * req.body.investments.averageReturns; // Income from other sources

      const newMonthlyFinance = await MonthlyFinanceSchema.create({
        user: userId,
        month: currentMonth,
        year: currentYear,
        income: {
          salary: salary,
          otherSources: otherSources, // Income from other sources
          total: salary + otherSources // Total income
        },
        expenses: {
          needs: {
            rent: req.body.needs.rent,
            food: req.body.needs.food,
            electricity: req.body.needs.electricity,
            mobile: req.body.needs.mobile,
            clothes: req.body.needs.clothes,
            transport: req.body.needs.transport,
            internet: req.body.needs.internet,
            total: req.body.needs.rent + req.body.needs.food + req.body.needs.electricity +
                   req.body.needs.mobile + req.body.needs.clothes + req.body.needs.transport +
                   req.body.needs.internet, // Total needs expenses
            overUnderBudget: req.body.needs.overUnderBudget,
          },
          wants: {
            carBike: req.body.wants.carBike,
            phone: req.body.wants.phone,
            vacation: req.body.wants.vacation,
            clothes: req.body.wants.clothes,
            diningOut: req.body.wants.diningOut,
            total: req.body.wants.carBike + req.body.wants.phone + req.body.wants.vacation +
                   req.body.wants.clothes + req.body.wants.diningOut, // Total wants expenses
            overUnderBudget: req.body.wants.overUnderBudget,
          },
          totalExpenses: req.body.needs.total + req.body.wants.total, // Total expenses for the month
        },
        savings: {
          bank: req.body.totalsavings.bank, // Monthly savings in the bank
          emergencyFund: req.body.totalsavings.emergencyFund, // Savings for emergencies
          totalSavings: req.body.totalsavings.emergencyFund, // Total savings
        },
        investments: {
          nifty50: {
            allocation: req.body.investments.nifty50.allocation,
            startingAmount: req.body.investments.nifty50.startingAmount,
            returns: req.body.investments.nifty50.returns,
          },
          midCap: {
            allocation: req.body.investments.midCap.allocation,
            startingAmount: req.body.investments.midCap.startingAmount,
            returns: req.body.investments.midCap.returns,
          },
          smallCap: {
            allocation: req.body.investments.smallCap.allocation,
            startingAmount: req.body.investments.smallCap.startingAmount,
            returns: req.body.investments.smallCap.returns,
          },
          totalInvestment: req.body.investments.totalInvestment,
          averageReturns: req.body.investments.averageReturns,
        },
        netWorth: (
          req.body.totalsavings.emergencyFund + 
          req.body.investments.nifty50.startingAmount + 
          req.body.investments.midCap.startingAmount + 
          req.body.investments.smallCap.startingAmount + 
          salary + otherSources
        ) - (
          req.body.needs.total + req.body.wants.total
        ), // Net worth calculated for the month
        lastUpdate: newDate, // Last updated date for this record
      });

      console.log('New MonthlyFinance entry created:', newMonthlyFinance);
    }

    // Update the user's financial data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "totalsavings.emergencyFund": req.body.totalsavings.emergencyFund,
          "totalsavings.bank": req.body.totalsavings.bank,
          "needs.rent": req.body.needs.rent,
          "needs.food": req.body.needs.food,
          "needs.electricity": req.body.needs.electricity,
          "needs.mobile": req.body.needs.mobile,
          "needs.clothes": req.body.needs.clothes,
          "needs.transport": req.body.needs.transport,
          "needs.internet": req.body.needs.internet,
          "needs.total": req.body.needs.total,
          "needs.overUnderBudget": req.body.needs.overUnderBudget,
          "wants.carBike": req.body.wants.carBike,
          "wants.phone": req.body.wants.phone,
          "wants.vacation": req.body.wants.vacation,
          "wants.clothes": req.body.wants.clothes,
          "wants.diningOut": req.body.wants.diningOut,
          "wants.total": req.body.wants.total,
          "wants.overUnderBudget": req.body.wants.overUnderBudget,
          "investments.nifty50.allocation": req.body.investments.nifty50.allocation,
          "investments.nifty50.startingAmount": req.body.investments.nifty50.startingAmount,
          "investments.nifty50.returns": req.body.investments.nifty50.returns,
          "investments.midCap.allocation": req.body.investments.midCap.allocation,
          "investments.midCap.startingAmount": req.body.investments.midCap.startingAmount,
          "investments.midCap.returns": req.body.investments.midCap.returns,
          "investments.smallCap.allocation": req.body.investments.smallCap.allocation,
          "investments.smallCap.startingAmount": req.body.investments.smallCap.startingAmount,
          "investments.smallCap.returns": req.body.investments.smallCap.returns,
          "investments.totalInvestment": req.body.investments.totalInvestment,
          "investments.averageReturns": req.body.investments.averageReturns,
          "anumsalary": req.body.anumsalary,
          "monthsalary": req.body.monthsalary,
          "lastFinancialUpdate": currentDate
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'Failed to update user data' });
    }

    res.json({ success: true, message: 'User data saved successfully!', user: updatedUser });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};






exports.GetamountInvested = async (req, res) => {
  try {
    // Step 1: Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Step 2: Verify the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Step 3: Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Extract investment data
    const investments = user.investments;
    const nifty50 = investments.nifty50;
    const midCap = investments.midCap;
    const smallCap = investments.smallCap;

    // Step 5: Calculate current value of each investment
    const nifty50CurrentValue = nifty50.startingAmount * (1 + nifty50.returns / 100);
    const midCapCurrentValue = midCap.startingAmount * (1 + midCap.returns / 100);
    const smallCapCurrentValue = smallCap.startingAmount * (1 + smallCap.returns / 100);

    // Step 6: Calculate the total investment and the increase in value
    const totalInvestment = nifty50CurrentValue + midCapCurrentValue + smallCapCurrentValue;
    const totalIncrease = (nifty50CurrentValue - nifty50.startingAmount) + 
                          (midCapCurrentValue - midCap.startingAmount) + 
                          (smallCapCurrentValue - smallCap.startingAmount);

    // Step 7: Return the calculated values
    res.json({
      success: true,
      message: 'Investment data retrieved successfully!',
      totalInvestment,
      totalIncrease
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const axios = require('axios');

exports.StocksTradeInfoGroww = async (req, res) => {
  try {
    const { symbol } = req.params;


    const apiUrl = `https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/CASH/latest_prices_ohlc/${symbol}`;

    // Make a GET request to the Groww API
    const response = await axios.get(apiUrl);

    // Check if data exists in the response
    if (response.data) {
      // Return the stock data as a JSON response
      return res.json(response.data);
    } else {
      return res.status(404).json({ message: 'Stock data not found' });
    }
  } catch (err) {
    console.error('Error fetching stock data:', err);
    // Return a 500 server error if something goes wrong
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};




exports.TalkWithMe = async (req, res) => {
  try {
    const formData = req.body;

    const talkWithEntry = new TalkwithSchema({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    await talkWithEntry.save();

    res.status(201).json({ message: 'Message received successfully!' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.StocksTop= async (req, res) => {
  try {
    
    const response = await axios.get('https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=TOP_GAINERS%2CTOP_LOSERS%2CSTOCKS_IN_NEWS%2CMOST_VALUABLE%2CPOPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER&page=0&size=5');

    // Check if data exists in the response
    if (response.data) {
      // Return the stock data as a JSON response
      return res.json(response.data.exploreCompanies);
    } else {
      return res.status(404).json({ message: 'Stock data not found' });
    }
  } catch (err) {
    console.error('Error fetching stock data:', err);
    // Return a 500 server error if something goes wrong
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.StocksDetail = async (req, res) => {
  try {
    const { scriptCode } = req.params;

    // Fetching stock data from Groww API
    const response = await axios.get('https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=TOP_GAINERS%2CTOP_LOSERS%2CSTOCKS_IN_NEWS%2CMOST_VALUABLE%2CPOPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER&page=0&size=5');

    // Checking if the API response has the expected data
    if (response.data && response.data.exploreCompanies) {
      // Categories to check for the stock code
      const categories = ['MOST_VALUABLE', 'TOP_LOSERS', 'TOP_GAINERS', 'STOCKS_IN_NEWS', 'POPULAR_STOCKS_MOST_BOUGHT_BY_TURNOVER'];

      // Loop through each category to find the stock
      for (let category of categories) {
        if (response.data.exploreCompanies[category]) {
          // Find the stock that matches the script code
          const stock = response.data.exploreCompanies[category].find(company => company.company.nseScriptCode === scriptCode);

          // If stock is found, return its details
          if (stock) {
            const stockResponse = await axios.get(`https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/CASH/latest_prices_ohlc/${stock.company.nseScriptCode}`);

              return res.json({
                company: stock.company,
                stats: stock.stats,
                stock_data: stockResponse.data 
              });
              
          }
        }
      }

      // Return if the stock symbol wasn't found
      return res.status(404).json({ message: `Stock with symbol ${scriptCode} not found` });
    } else {
      return res.status(404).json({ message: 'Stock data not found' });
    }
  } catch (err) {
    console.error('Error fetching stock data:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};





exports.StockChartData = async (req, res) => {
  try {
    const { stockId } = req.params;

    const apiUrl = `https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/CASH/latest_prices_ohlc/${stockId}`;

    const response = await axios.get(apiUrl);

    if (response.data) {
      const newStock = {
        "lastTradeTime": response.data.lastTradeTime,
         "open": response.data.open,
         "high": response.data.high,
          "low": response.data.low,
          "close": response.data.close,
            "ltp": response.data.ltp,
      }

      return res.json(newStock);
    } else {
      return res.status(404).json({ message: 'Stock data not found' });
    }
  } catch (err) {
    console.error('Error fetching stock data:', err);
    // Return a 500 server error if something goes wrong
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.GetCraditCard = async (req, res) => {
  try {
    const craditCardresponse = await creditCardSchema.find({});

    res.status(200).json(craditCardresponse);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.GetMutualfund = async (req, res) => {
  try {
    
    const response = await axios.get('https://groww.in/v1/api/search/v1/derived/scheme');

    if (response.data) {
      // Return the stock data as a JSON response
      return res.json(response.data.content);
    } else {
      return res.status(404).json({ message: 'Stock data not found' });
    }
  } catch (err) {
    console.error('Error fetching Fd data:', err);
    // Return a 500 server error if something goes wrong
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
