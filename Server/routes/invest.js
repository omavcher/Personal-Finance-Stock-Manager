const express = require("express");
const router = express.Router();
const investController = require("../controllers/investController.js");
const auth = require("../middlewares/auth.js")

router.get("/invest-imp-info", auth, investController.investImpInfo );


module.exports = router;
