const mongoose = require("mongoose");
const Product = require("../models/Product");
const findProductByParam = require("../utils/findProduct");
const HttpError = require("../utils/HttpError");

function formatProduct(product) {
  return {
    id: product._id.toString(),
    legacyId: product.id || null,
    name: product.name,
    supplier: product.suppliers,
    suppliers: product.suppliers,
    stock: product.stock,
    price: product.price,
    category: product.category,
    image: product.photo,
    photo: product.photo,
    description: product.description || "",
    shopId: product.shopId,
  };
}

function dedupeCatalogProducts(products) {
  const seen = new Set();

  return products.filter((product) => {
    if (!product.id) {
      return false;
    }

    const key = String(product.id);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function listProducts(req, res) {
  const shopObjectId = req.shop._id;
  const [allProducts, categories, suppliers] = await Promise.all([
    Product.find().sort({ createdAt: -1 }),
    Product.distinct("category"),
    Product.distinct("suppliers"),
  ]);

  const catalogProducts = dedupeCatalogProducts(allProducts);
  const shopProducts = allProducts.filter(
    (product) =>
      product.shopId && product.shopId.toString() === shopObjectId.toString()
  );

  res.status(200).json({
    products: shopProducts.map(formatProduct),
    catalog: catalogProducts.map(formatProduct),
    categories: categories.filter(Boolean).sort(),
    suppliers: suppliers.filter(Boolean).sort(),
  });
}

async function addProduct(req, res) {
  const product = await Product.create({
    shopId: req.shop._id,
    name: req.body.name,
    category: req.body.category,
    stock: req.body.stock,
    suppliers: req.body.suppliers,
    price: req.body.price.replace(",", "."),
    description: req.body.description || "",
    photo: req.file ? `/uploads/products/${req.file.filename}` : null,
  });

  res.status(201).json({
    message: "Product added successfully",
    product: formatProduct(product),
  });
}

async function getProduct(req, res) {
  const reviews = await mongoose.connection.db
    .collection("reviews")
    .find()
    .toArray();

  res.status(200).json({
    product: formatProduct(req.product),
    reviews: reviews.map((review) => ({
      id: review._id.toString(),
      author: review.name,
      date: review.date || "",
      text: review.testimonial,
    })),
  });
}

async function updateProduct(req, res) {
  const product = req.product;

  product.name = req.body.name;
  product.category = req.body.category;
  product.stock = req.body.stock;
  product.suppliers = req.body.suppliers;
  product.price = req.body.price.replace(",", ".");
  product.description = req.body.description || "";

  if (req.file) {
    product.photo = `/uploads/products/${req.file.filename}`;
  }

  await product.save();

  res.status(200).json({
    message: "Product updated successfully",
    product: formatProduct(product),
  });
}

async function addCatalogToShop(req, res) {
  const source = req.product;
  const shopId = req.shop._id;

  const existing = await Product.findOne({
    shopId,
    name: source.name,
    suppliers: source.suppliers,
  });

  if (existing) {
    throw new HttpError(409, "Product is already in your shop");
  }

  const product = await Product.create({
    shopId,
    name: source.name,
    category: source.category,
    stock: source.stock,
    suppliers: source.suppliers,
    price: source.price,
    description: source.description || "",
    photo: source.photo,
  });

  res.status(201).json({
    message: "Product added to shop successfully",
    product: formatProduct(product),
  });
}

async function deleteProduct(req, res) {
  await Product.deleteOne({ _id: req.product._id });

  res.status(200).json({
    message: "Product deleted successfully",
  });
}

async function loadProduct(req, res, next) {
  try {
    req.product = await findProductByParam(req.params.productId);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  addProduct,
  addCatalogToShop,
  getProduct,
  updateProduct,
  deleteProduct,
  loadProduct,
};
