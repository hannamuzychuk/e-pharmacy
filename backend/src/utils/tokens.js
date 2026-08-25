const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function createTokenId() {
  return crypto.randomUUID();
}

function createAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role || "owner",
      jti: createTokenId(),
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
      jti: createTokenId(),
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || "30d" }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

function createSessionTokens(user) {
  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  };
}

module.exports = {
  createSessionTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
