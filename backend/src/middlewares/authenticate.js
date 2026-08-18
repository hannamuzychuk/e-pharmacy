const HttpError = require("../utils/HttpError");
const { verifyAccessToken } = require("../utils/tokens");
const User = require("../models/User");

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new HttpError(401, "Not authorized");
    }

    const token = authorization.slice(7);
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      throw new HttpError(401, "Not authorized");
    }

    const user = await User.findById(payload.id);
    if (!user) {
      throw new HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;
