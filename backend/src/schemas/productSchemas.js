const Joi = require("joi");

const name = Joi.string().trim().min(2).max(120).required().messages({
  "string.empty": "Product name is required",
  "string.min": "Product name must be at least 2 characters",
  "any.required": "Product name is required",
});

const category = Joi.string().trim().min(2).max(80).required().messages({
  "string.empty": "Category is required",
  "any.required": "Category is required",
});

const stock = Joi.string().trim().min(1).max(10).required().messages({
  "string.empty": "Stock is required",
  "any.required": "Stock is required",
});

const suppliers = Joi.string().trim().min(2).max(120).required().messages({
  "string.empty": "Suppliers is required",
  "any.required": "Suppliers is required",
});

const price = Joi.string()
  .trim()
  .pattern(/^\d+([.,]\d{1,2})?$/)
  .required()
  .messages({
    "string.empty": "Price is required",
    "string.pattern.base": "Enter a valid price",
    "any.required": "Price is required",
  });

const description = Joi.string().trim().min(5).max(500).allow("").messages({
  "string.min": "Description must be at least 5 characters",
});

const addProductSchema = Joi.object({
  name,
  category,
  stock,
  suppliers,
  price,
  description: description.optional(),
});

const updateProductSchema = Joi.object({
  name,
  category,
  stock,
  suppliers,
  price,
  description: description.optional(),
});

module.exports = { addProductSchema, updateProductSchema };
