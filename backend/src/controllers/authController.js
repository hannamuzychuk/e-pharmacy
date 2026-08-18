const bcrypt = require("bcrypt");
const User = require("../models/User");
const HttpError = require("../utils/HttpError");
const { createSessionTokens, verifyRefreshToken } = require("../utils/tokens");
const { getShopIdByOwner } = require("../services/ensureShop");

async function register(req, res) {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new HttpError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const tokens = createSessionTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  const shopId = await getShopIdByOwner(user);

  res.status(200).json({
    message: "Login successful",
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopId,
    },
  });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new HttpError(401, "Not authorized");
  }

  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new HttpError(401, "Not authorized");
  }

  const tokens = createSessionTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

async function logout(req, res) {
  req.user.refreshToken = null;
  await req.user.save();

  res.status(200).json({
    message: "Logout successful",
  });
}

async function getUserInfo(req, res) {
  const shopId = await getShopIdByOwner(req.user);

  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
    shopId,
  });
}

module.exports = { register, login, refresh, logout, getUserInfo };
