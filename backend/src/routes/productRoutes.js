const express = require("express");
const {
  listProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  loadProduct,
} = require("../controllers/productController");
const authenticate = require("../middlewares/authenticate");
const isShopOwner = require("../middlewares/isShopOwner");
const uploadProductPhoto = require("../middlewares/uploadProductPhoto");
const validateBody = require("../middlewares/validateBody");
const {
  addProductSchema,
  updateProductSchema,
} = require("../schemas/productSchemas");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router({ mergeParams: true });

router.get(
  "/:shopId/product",
  authenticate,
  isShopOwner,
  ctrlWrapper(listProducts)
);

router.post(
  "/:shopId/product/add",
  authenticate,
  isShopOwner,
  uploadProductPhoto,
  validateBody(addProductSchema),
  ctrlWrapper(addProduct)
);

router.get(
  "/:shopId/product/:productId",
  authenticate,
  isShopOwner,
  ctrlWrapper(loadProduct),
  ctrlWrapper(getProduct)
);

router.put(
  "/:shopId/product/:productId/edit",
  authenticate,
  isShopOwner,
  uploadProductPhoto,
  validateBody(updateProductSchema),
  ctrlWrapper(loadProduct),
  ctrlWrapper(updateProduct)
);

router.delete(
  "/:shopId/product/:productId/delete",
  authenticate,
  isShopOwner,
  ctrlWrapper(loadProduct),
  ctrlWrapper(deleteProduct)
);

module.exports = router;
