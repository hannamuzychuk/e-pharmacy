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

function formatProduct(product) {
  return {
    id: product._id.toString(),
    name: product.name,
    category: product.category,
    supplier: product.suppliers,
    price: parseAmount(product.price),
    stock: product.stock,
    image: product.photo || "",
  };
}

function formatSupplier(supplier) {
  return {
    id: supplier._id.toString(),
    name: supplier.name,
    company: supplier.suppliers,
    address: supplier.address,
    amount: parseAmount(supplier.amount),
    status: supplier.status,
  };
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

function normalizeProductId(id) {
  if (id == null || id === "") {
    return null;
  }

  const normalized = String(id).trim().replace(/^0+/, "");
  return normalized || "0";
}

function buildProductLookup(products) {
  const lookup = new Map();

  for (const product of products) {
    if (product.id == null) {
      continue;
    }

    lookup.set(String(product.id), product);
    lookup.set(normalizeProductId(product.id), product);
  }

  return lookup;
}

async function getStatistics(req, res) {
  const db = mongoose.connection.db;
  const [products, customers, incomeExpensesRaw, suppliersRaw] = await Promise.all([
    Product.find({ id: { $exists: true, $ne: null } }).sort({ id: 1 }),
    db.collection("customers").find().toArray(),
    db.collection("Income-Expenses").find().sort({ _id: 1 }).toArray(),
    db.collection("suppliers").find().sort({ _id: 1 }).toArray(),
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
    products: uniqueProducts.map(formatProduct),
    suppliers: suppliersRaw.map(formatSupplier),
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

  const customerObjectId = new mongoose.Types.ObjectId(clientId);
  const goods = await db
    .collection("customer_goods")
    .find({ customerId: customerObjectId })
    .toArray();

  let productIds = goods.map((item) => item.productId);

  if (productIds.length === 0) {
    const customerPhoto = customer.photo || customer.image;

    if (customerPhoto) {
      const orders = await db
        .collection("orders")
        .find({ photo: customerPhoto })
        .sort({ order_date: -1 })
        .toArray();
      productIds = orders.map((order) => order.products).filter(Boolean);
    }
  }

  if (productIds.length === 0) {
    res.status(200).json([]);
    return;
  }

  const products = dedupeProducts(
    await Product.find({
      id: { $in: productIds.map((id) => String(id)) },
    }).sort({ id: 1 })
  );
  const productLookup = buildProductLookup(products);
  const purchases = [];

  for (const productId of productIds) {
    const product =
      productLookup.get(String(productId)) ||
      productLookup.get(normalizeProductId(productId));

    if (product) {
      purchases.push(formatPurchase(product));
    }
  }

  res.status(200).json(purchases);
}

module.exports = {
  getStatistics,
  getCustomerGoods,
};
