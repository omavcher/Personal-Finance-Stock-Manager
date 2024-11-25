// routes/budget.js
const express = require('express');
const router = express.Router();

// Define budget routes here
router.get('/', (req, res) => {
    res.send('Budget route');
});

module.exports = router;
