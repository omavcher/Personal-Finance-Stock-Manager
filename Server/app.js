const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_LINK, 
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type',
}));




mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });


app.get("/", (req, res) => {
  res.send("Welcome to the PlanAhead Home Page!");
});

app.use("/api/users", require("./routes/users.js"));
app.use("/api/invest", require("./routes/invest.js"));
app.use("/api/budget", require("./routes/budget.js"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
