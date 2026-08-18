const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  getUserInfo,
} = require("../controllers/authController");
const validateBody = require("../middlewares/validateBody");
const authenticate = require("../middlewares/authenticate");
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require("../schemas/authSchemas");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(register));
router.post("/login", validateBody(loginSchema), ctrlWrapper(login));
router.post("/refresh", validateBody(refreshSchema), ctrlWrapper(refresh));
router.get("/logout", authenticate, ctrlWrapper(logout));
router.get("/user-info", authenticate, ctrlWrapper(getUserInfo));

module.exports = router;
