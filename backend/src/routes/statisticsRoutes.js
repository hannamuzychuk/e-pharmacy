const express = require("express");
const {
  getStatistics,
  getCustomerGoods,
} = require("../controllers/statisticsController");
const authenticate = require("../middlewares/authenticate");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.get("/", authenticate, ctrlWrapper(getStatistics));
router.get("/:clientId/goods", authenticate, ctrlWrapper(getCustomerGoods));

module.exports = router;
