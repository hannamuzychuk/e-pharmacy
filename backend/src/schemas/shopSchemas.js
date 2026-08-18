const Joi = require("joi");

const shopName = Joi.string().trim().min(2).max(80).required().messages({
  "string.empty": "Shop name is required",
  "string.min": "Shop name must be at least 2 characters",
  "any.required": "Shop name is required",
});

const ownerName = Joi.string().trim().min(2).max(50).required().messages({
  "string.empty": "Owner name is required",
  "string.min": "Owner name must be at least 2 characters",
  "any.required": "Owner name is required",
});

const email = Joi.string().trim().email().required().messages({
  "string.empty": "Email is required",
  "string.email": "Enter a valid email",
  "any.required": "Email is required",
});

const phone = Joi.string()
  .trim()
  .pattern(/^[0-9+\-\s()]{7,20}$/)
  .required()
  .messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Enter a valid phone number",
    "any.required": "Phone number is required",
  });

const streetAddress = Joi.string().trim().min(2).max(120).required().messages({
  "string.empty": "Street address is required",
  "any.required": "Street address is required",
});

const city = Joi.string().trim().min(2).max(80).required().messages({
  "string.empty": "City is required",
  "any.required": "City is required",
});

const zipCode = Joi.string().trim().max(16).allow("").required().messages({
  "any.required": "Zip / Postal is required",
});

const hasDelivery = Joi.string().valid("yes", "no").required().messages({
  "any.only": "Please select an option",
  "any.required": "Please select an option",
});

const createShopSchema = Joi.object({
  shopName,
  ownerName,
  email,
  phone,
  streetAddress,
  city,
  zipCode,
  password: Joi.string().min(6).max(64).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  hasDelivery,
});

const updateShopSchema = Joi.object({
  shopName,
  ownerName,
  email,
  phone,
  streetAddress,
  city,
  zipCode,
  hasDelivery,
});

module.exports = { createShopSchema, updateShopSchema };
