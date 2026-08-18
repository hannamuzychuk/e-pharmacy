const mongoose = require("mongoose");
const Product = require("../models/Product");
const findProductByParam = require("../utils/findProduct");

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

async function listProducts(req, res) {
  const [products, categories] = await Promise.all([
    Product.find().sort({ createdAt: -1 }),
    Product.distinct("category"),
  ]);

  res.status(200).json({
    products: products.map(formatProduct),
    categories: categories.sort(),
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
  getProduct,
  updateProduct,
  deleteProduct,
  loadProduct,
};
