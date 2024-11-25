const mongoose = require("mongoose");

const MonthlyFinanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  month: { type: Number, required: true, min: 1, max: 12 }, // Month (1 = January, 12 = December)
  year: { type: Number, required: true }, // Year (e.g., 2024)
  
  // Monthly financial data
  income: {
    salary: { type: Number }, // Monthly salary
    otherSources: { type: Number }, // Income from other sources
    total: { type: Number } // Total income for the month
  },

  expenses: {
    needs: {
      rent: { type: Number },
      food: { type: Number },
      electricity: { type: Number },
      mobile: { type: Number },
      clothes: { type: Number },
      transport: { type: Number },
      internet: { type: Number },
      total: { type: Number },
      overUnderBudget: { type: String, enum: ["Over", "Under", "none"] },
    },
    wants: {
      carBike: { type: Number },
      phone: { type: Number },
      vacation: { type: Number },
      clothes: { type: Number },
      diningOut: { type: Number },
      total: { type: Number },
      overUnderBudget: { type: String, enum: ["Over", "Under", "none"] },
    },
    totalExpenses: { type: Number }, // Total expenses for the month
  },

  savings: {
    bank: { type: Number }, // Monthly savings in the bank
    emergencyFund: { type: Number }, // Savings for emergencies
    totalSavings: { type: Number }, // Total savings for the month
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

  netWorth: { type: Number }, // Net worth calculated for the month
  lastUpdate: { type: Date, default: Date.now }, // Last updated date for this record
});

module.exports = mongoose.model("MonthlyFinance", MonthlyFinanceSchema);
