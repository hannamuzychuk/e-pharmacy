require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Shop = require("../src/models/Shop");
const Product = require("../src/models/Product");
const { seedShopCatalog } = require("../src/services/seedShopCatalog");

async function seedShopProducts() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const shops = await Shop.find().sort({ createdAt: 1 });

  if (shops.length === 0) {
    console.log("No shops found.");
    await mongoose.disconnect();
    return;
  }

  for (const shop of shops) {
    const before = await Product.countDocuments({ shopId: shop._id });
    const added = await seedShopCatalog(shop._id);
    const after = await Product.countDocuments({ shopId: shop._id });
    console.log(
      `${shop.shopName}: ${before} -> ${after} products (${added} added)`
    );
  }

  await mongoose.disconnect();
}

seedShopProducts().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
