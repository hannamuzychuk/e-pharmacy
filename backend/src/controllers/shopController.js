const bcrypt = require("bcrypt");
const Shop = require("../models/Shop");
const HttpError = require("../utils/HttpError");

function formatShop(shop) {
  return {
    id: shop._id,
    shopName: shop.shopName,
    ownerName: shop.ownerName,
    email: shop.email,
    phone: shop.phone,
    streetAddress: shop.streetAddress,
    city: shop.city,
    zipCode: shop.zipCode,
    hasDelivery: shop.hasDelivery ? "yes" : "no",
    logoUrl: shop.logoUrl,
    ownerId: shop.ownerId,
  };
}

async function createShop(req, res) {
  const existingShop = await Shop.findOne({ ownerId: req.user._id });
  if (existingShop) {
    throw new HttpError(409, "Shop already exists");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const shop = await Shop.create({
    ownerId: req.user._id,
    shopName: req.body.shopName,
    ownerName: req.body.ownerName,
    email: req.body.email,
    phone: req.body.phone,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    zipCode: req.body.zipCode,
    password: hashedPassword,
    hasDelivery: req.body.hasDelivery === "yes",
    logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : null,
  });

  res.status(201).json({
    message: "Shop created successfully",
    shop: formatShop(shop),
  });
}

function getShop(req, res) {
  res.status(200).json({
    shop: formatShop(req.shop),
  });
}

async function updateShop(req, res) {
  const shop = req.shop;

  shop.shopName = req.body.shopName;
  shop.ownerName = req.body.ownerName;
  shop.email = req.body.email;
  shop.phone = req.body.phone;
  shop.streetAddress = req.body.streetAddress;
  shop.city = req.body.city;
  shop.zipCode = req.body.zipCode;
  shop.hasDelivery = req.body.hasDelivery === "yes";

  if (req.file) {
    shop.logoUrl = `/uploads/logos/${req.file.filename}`;
  }

  await shop.save();

  res.status(200).json({
    message: "Shop data updated successfully",
    shop: formatShop(shop),
  });
}

module.exports = { createShop, getShop, updateShop };
