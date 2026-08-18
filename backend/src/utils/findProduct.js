const { isValidObjectId } = require("mongoose");
const Product = require("../models/Product");
const HttpError = require("./HttpError");

async function findProductByParam(productId) {
  if (isValidObjectId(productId)) {
    const product = await Product.findById(productId);
    if (product) {
      return product;
    }
  }

  const product = await Product.findOne({ id: productId });
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  return product;
}

module.exports = findProductByParam;
