const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  jobType: { type: String, required: true },
  anumsalary: { type: Number, required: true },
  monthsalary: { type: Number, required: true },
  totalsavings: {
    bank: { type: Number, required: true },
    emergencyFund: { type: Number, required: true }
  },
  needs: {
    rent: { type: Number, required: true },
    food: { type: Number, required: true },
    electricity: { type: Number, required: true },
    mobile: { type: Number, required: true },
    clothes: { type: Number, required: true },
    transport: { type: Number, required: true },
    internet: { type: Number, required: true },
    total: { type: Number, required: true },
    overUnderBudget: { type: String, required: true }
  },
  wants: {
    carBike: { type: Number, required: true },
    phone: { type: Number, required: true },
    vacation: { type: Number, required: true },
    clothes: { type: Number, required: true },
    diningOut: { type: Number, required: true },
    total: { type: Number, required: true },
    overUnderBudget: { type: String, required: true }
  },
  investments: {
    nifty50: {
      allocation: { type: Number, required: true },
      startingAmount: { type: Number, required: true },
      returns: { type: Number, required: true }
    },
    midCap: {
      allocation: { type: Number, required: true },
      startingAmount: { type: Number, required: true },
      returns: { type: Number, required: true }
    },
    smallCap: {
      allocation: { type: Number, required: true },
      startingAmount: { type: Number, required: true },
      returns: { type: Number, required: true }
    },
    totalInvestment: { type: Number, required: true },
    averageReturns: { type: Number, required: true }
  },
  inflationRate: { type: Number, required: true }
});

// Pre-save hook to calculate totalInvestment and averageReturns
UserSchema.pre('save', function (next) {
  // Calculate total investment
  const investments = this.investments;
  const totalInvestment = investments.nifty50.startingAmount + investments.midCap.startingAmount + investments.smallCap.startingAmount;

  // Calculate average returns
  const weightedReturns = (
    (investments.nifty50.startingAmount * investments.nifty50.returns) +
    (investments.midCap.startingAmount * investments.midCap.returns) +
    (investments.smallCap.startingAmount * investments.smallCap.returns)
  );
  const averageReturns = (weightedReturns / totalInvestment);

  // Set calculated values
  this.investments.totalInvestment = totalInvestment;
  this.investments.averageReturns = averageReturns.toFixed(2); // Limit to 2 decimal places

  next();
});

// Create the User model
const User = mongoose.model("User", UserSchema);

// Create a new user document
const newUser = new User({
  name: "John Doe",
  age: 30,
  jobType: "Software Developer",
  anumsalary: 72000,
  monthsalary: 6000,
  totalsavings: {
    bank: 10000,
    emergencyFund: 5000
  },
  needs: {
    rent: 1500,
    food: 500,
    electricity: 100,
    mobile: 50,
    clothes: 200,
    transport: 150,
    internet: 60,
    total: 2560,
    overUnderBudget: "Under"
  },
  wants: {
    carBike: 500,
    phone: 1000,
    vacation: 2000,
    clothes: 300,
    diningOut: 150,
    total: 3950,
    overUnderBudget: "Over"
  },
  investments: {
    nifty50: {
      allocation: 60,
      startingAmount: 3600,
      returns: 12
    },
    midCap: {
      allocation: 25,
      startingAmount: 1500,
      returns: 15
    },
    smallCap: {
      allocation: 15,
      startingAmount: 900,
      returns: 18
    },
    totalInvestment: 0, // Will be calculated
    averageReturns: 0 // Will be calculated
  },
  inflationRate: 6
});

// Save the user to the database
newUser.save()
  .then(() => console.log("User saved successfully"))
  .catch(err => console.log("Error saving user:", err));

module.exports = User;
