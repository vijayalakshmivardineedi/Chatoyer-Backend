const express = require("express");
const { getGoldPrice } = require("../controllers/goldRate");
const router = express.Router();


router.get("/user/getGoldPrice", getGoldPrice);
router.get("/admin/getGoldPrice", getGoldPrice);

module.exports = router;