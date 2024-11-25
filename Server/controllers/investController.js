const User = require("../models/User.js");
const MonthlyFinanceSchema = require("../models//MonthlyFinanceSchema.js");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 
const nodemailer = require("nodemailer");
const crypto = require("crypto");
let otpStorage = {}; 


exports.investImpInfo = async (req, res) => {
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


    res.status(200).json(user.investments);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};