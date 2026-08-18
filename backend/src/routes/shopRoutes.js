const express = require("express");
const {
  createShop,
  getShop,
  updateShop,
} = require("../controllers/shopController");
const authenticate = require("../middlewares/authenticate");
const isShopOwner = require("../middlewares/isShopOwner");
const uploadLogo = require("../middlewares/uploadLogo");
const validateBody = require("../middlewares/validateBody");
const {
  createShopSchema,
  updateShopSchema,
} = require("../schemas/shopSchemas");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.post(
  "/create",
  authenticate,
  uploadLogo,
  validateBody(createShopSchema),
  ctrlWrapper(createShop)
);

router.get("/:shopId", authenticate, isShopOwner, ctrlWrapper(getShop));

router.put(
  "/:shopId/update",
  authenticate,
  isShopOwner,
  uploadLogo,
  validateBody(updateShopSchema),
  ctrlWrapper(updateShop)
);

module.exports = router;
