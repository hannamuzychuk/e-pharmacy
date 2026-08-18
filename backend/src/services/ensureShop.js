const mongoose = require("mongoose");
const Shop = require("../models/Shop");

async function pickPharmacy(index) {
  const pharmacies = mongoose.connection.collection("pharmacies");
  const total = await pharmacies.countDocuments();
  if (total === 0) {
    return null;
  }

  return pharmacies.find().skip(index % total).limit(1).next();
}

async function ensureShopForUser(user) {
  const existingShop = await Shop.findOne({ ownerId: user._id });
  if (existingShop) {
    return existingShop;
  }

  const shopCount = await Shop.countDocuments();
  const pharmacy = await pickPharmacy(shopCount);
  if (!pharmacy) {
    return null;
  }

  return Shop.create({
    ownerId: user._id,
    shopName: pharmacy.name,
    ownerName: user.name,
    email: user.email,
    phone: pharmacy.phone || user.phone,
    streetAddress: pharmacy.address || "",
    city: pharmacy.city || "",
    zipCode: "01001",
    hasDelivery: true,
    logoUrl: null,
  });
}

async function getShopIdByOwner(user) {
  const shop = await ensureShopForUser(user);
  return shop ? shop._id : null;
}

module.exports = { ensureShopForUser, getShopIdByOwner };
