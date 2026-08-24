require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Product = require("../src/models/Product");

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

function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function pickProductIdsForCustomer(customerId, products) {
  if (products.length === 0) {
    return [];
  }

  const hash = hashString(customerId);
  const count = 2 + (hash % 2);
  const productIds = [];
  const used = new Set();

  for (let i = 0; i < count; i += 1) {
    let index = (hash + i * 7) % products.length;
    let attempts = 0;

    while (attempts < products.length) {
      const product = products[index];
      const productId = String(product.id);

      if (!used.has(productId)) {
        used.add(productId);
        productIds.push(productId);
        break;
      }

      index = (index + 1) % products.length;
      attempts += 1;
    }
  }

  return productIds;
}

async function seedCustomerGoods({ force = false } = {}) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection("customer_goods");

  const [customers, products] = await Promise.all([
    db.collection("customers").find().sort({ _id: 1 }).toArray(),
    dedupeProducts(
      await Product.find({ id: { $exists: true, $ne: null } }).sort({ id: 1 })
    ),
  ]);

  if (products.length === 0) {
    throw new Error("No seed products found in products collection");
  }

  if (force) {
    await collection.deleteMany({});
  }

  const existingCount = await collection.countDocuments();
  if (existingCount > 0 && !force) {
    console.log(
      `customer_goods already has ${existingCount} documents. Use --force to recreate.`
    );
    await mongoose.disconnect();
    return;
  }

  const docs = [];

  for (const customer of customers) {
    const customerId = customer._id;
    const productIds = pickProductIdsForCustomer(customerId.toString(), products);

    for (const productId of productIds) {
      docs.push({
        customerId,
        productId,
      });
    }
  }

  if (docs.length > 0) {
    await collection.insertMany(docs, { ordered: true });
  }

  await collection.createIndex({ customerId: 1 });
  await collection.createIndex({ customerId: 1, productId: 1 }, { unique: true });

  console.log(
    `Seeded customer_goods: ${docs.length} purchase rows for ${customers.length} customers`
  );

  await mongoose.disconnect();
}

const force = process.argv.includes("--force");

seedCustomerGoods({ force }).catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
