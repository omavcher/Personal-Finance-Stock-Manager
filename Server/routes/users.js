const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth.js")

router.get("/id", userController.getUserProfile);

router.post("/otp", userController.otp);

router.post("/verify-otp", userController.verifyOtp);

router.post("/register", userController.register);

router.post("/login", userController.LogIn);


router.get("/get-user",auth, userController.getUserProfile);

router.get("/calculate-profile-complection",auth, userController.CalculateProfileCompletionScore);

router.post("/putuser/subinfo",auth, userController.Subdetailput);


router.get("/check/usersub/info1",auth, userController.CheckUserSubInfo1);


router.post("/save-user/remaininfo",auth, userController.SaveUserRemainInfo);


router.get("/get-amount/invesment",auth, userController.GetamountInvested);

router.get("/stocks/:symbol", userController.StocksTradeInfoGroww);

router.post("/talk-with-me", userController.TalkWithMe);


router.get("/top/stocks", userController.StocksTop);

router.get("/stocks/detail/:scriptCode", userController.StocksDetail);


router.get("/stocks/history/:stockId", userController.StockChartData);


router.get("/cradit/cards/info", userController.GetCraditCard);


router.get("/muture/funds", userController.GetMutualfund);

module.exports = router;
