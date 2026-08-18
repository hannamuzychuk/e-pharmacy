const { isValidObjectId } = require("mongoose");
const Shop = require("../models/Shop");
const HttpError = require("../utils/HttpError");

async function isShopOwner(req, res, next) {
  try {
    const { shopId } = req.params;

    if (!isValidObjectId(shopId)) {
      throw new HttpError(404, "Shop not found");
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new HttpError(404, "Shop not found");
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      throw new HttpError(403, "Forbidden");
    }

    req.shop = shop;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = isShopOwner;
