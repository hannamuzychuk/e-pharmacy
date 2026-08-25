const express = require("express");
const { proxyImage } = require("../controllers/imageController");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.get("/", ctrlWrapper(proxyImage));

module.exports = router;
