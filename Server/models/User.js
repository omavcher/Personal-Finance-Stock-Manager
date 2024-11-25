const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Only name is required
  age: { type: Number, required: true }, // Age is required
  email:{ type: String, required: true },
  anumsalary: { type: Number }, // Annual salary is required
  jobType: { type: String },
  monthsalary: { type: Number }, // Monthly salary (optional)
  totalsavings: {
    bank: { type: Number }, // Optional
    emergencyFund: { type: Number }, // Optional
  },
  birthdate: { type: Date }, // Corrected syntax here
  city: { type: String },
  lastFinancialUpdate: { type: Date },
  needs: {
    rent: { type: Number }, 
    food: { type: Number },
    electricity: { type: Number },
    mobile: { type: Number },
    clothes: { type: Number },
    transport: { type: Number },
    internet: { type: Number },
    total: { type: Number },
    overUnderBudget: { type: String, enum: ["Over", "Under","none"] },
  },

  wants: {
    carBike: { type: Number },
    phone: { type: Number },
    vacation: { type: Number },
    clothes: { type: Number },
    diningOut: { type: Number },
    total: { type: Number },
    overUnderBudget: { type: String, enum: ["Over", "Under","none"] },
  },

  investments: {
    nifty50: {
      allocation: { type: Number },
      startingAmount: { type: Number },
      returns: { type: Number },
    },
    midCap: {
      allocation: { type: Number },
      startingAmount: { type: Number },
      returns: { type: Number },
    },
    smallCap: {
      allocation: { type: Number },
      startingAmount: { type: Number },
      returns: { type: Number },
    },
    totalInvestment: { type: Number }, 
    averageReturns: { type: Number }, 
  },

  inflationRate: { type: Number, default: 6 },

  family: {
    maritalStatus: { type: String, enum: ["single", "married", "divorced", "partner-dead","none"] },
    childrenCount: { type: Number },
    childrenDetails: [
      {
        age: { type: Number },
        education: { type: String, enum: ["1-5th", "5-10th", "10th", "12th", "graduate","none"] }
      }
    ],
    parentsStatus: {
      mother: { type: String, enum: ["alive", "deceased","none"] },
      father: { type: String, enum: ["alive", "deceased","none"] }
    }
  }
});

module.exports = mongoose.model("User", UserSchema);
