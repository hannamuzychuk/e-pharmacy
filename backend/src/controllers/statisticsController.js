const mongoose = require("mongoose");
const Product = require("../models/Product");
const HttpError = require("../utils/HttpError");
const parseAmount = require("../utils/parseAmount");

function dedupeProducts(products) {
  const seen = new Set();

  return products.filter((product) => {
    const key = product.id ? `id:${product.id}` : `mongo:${product._id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function dedupeIncomeExpenses(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.name}|${item.type}|${item.amount}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function formatPurchase(product) {
  return {
    id: product._id.toString(),
    name: product.name,
    description:
      product.description ||
      `${product.category} product supplied by ${product.suppliers}`,
    image: product.photo || "",
    amount: parseAmount(product.price),
  };
}

function pickCustomerPurchases(products, customerId) {
  if (products.length === 0) {
    return [];
  }

  let hash = 0;
  for (let i = 0; i < customerId.length; i += 1) {
    hash = (hash + customerId.charCodeAt(i)) % products.length;
  }

  const count = Math.min(2 + (hash % 2), products.length);
  const purchases = [];

  for (let i = 0; i < count; i += 1) {
    purchases.push(formatPurchase(products[(hash + i) % products.length]));
  }

  return purchases;
}

async function getStatistics(req, res) {
  const db = mongoose.connection.db;
  const [products, customers, incomeExpensesRaw] = await Promise.all([
    Product.find({ id: { $exists: true, $ne: null } }).sort({ id: 1 }),
    db.collection("customers").find().toArray(),
    db.collection("Income-Expenses").find().sort({ _id: 1 }).toArray(),
  ]);

  const uniqueProducts = dedupeProducts(products);
  const supplierNames = new Set(
    uniqueProducts.map((product) => product.suppliers).filter(Boolean)
  );

  const recentCustomers = customers
    .map((customer) => ({
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      spent: parseAmount(customer.spent),
    }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const incomeExpenses = dedupeIncomeExpenses(incomeExpensesRaw).map((item) => ({
    id: item._id.toString(),
    type: item.type,
    description: item.name,
    amount: parseAmount(item.amount),
  }));

  res.status(200).json({
    metrics: {
      products: uniqueProducts.length,
      suppliers: supplierNames.size,
      customers: customers.length,
    },
    recentCustomers,
    incomeExpenses,
  });
}

async function getCustomerGoods(req, res) {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    throw new HttpError(400, "Invalid customer id");
  }

  const db = mongoose.connection.db;
  const customer = await db.collection("customers").findOne({
    _id: new mongoose.Types.ObjectId(clientId),
  });

  if (!customer) {
    throw new HttpError(404, "Customer not found");
  }

  const products = dedupeProducts(
    await Product.find({ id: { $exists: true, $ne: null } }).sort({ id: 1 })
  );

  res.status(200).json(pickCustomerPurchases(products, clientId));
}

module.exports = {
  getStatistics,
  getCustomerGoods,
};
