const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻа-яА-ЯіІїЇєЄґҐ\s'-]+$/)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 50 characters",
      "string.pattern.base": "Enter a valid name",
      "any.required": "Name is required",
    }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Enter a valid phone number",
      "any.required": "Phone number is required",
    }),
  password: Joi.string()
    .min(6)
    .max(64)
    .pattern(/[!@#$%^&*(),.?":{}|<>_\-+=]/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base": "Password must contain a special character",
      "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(64).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "string.empty": "Refresh token is required",
    "any.required": "Refresh token is required",
  }),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
