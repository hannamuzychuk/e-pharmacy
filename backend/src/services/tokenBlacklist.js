const TokenBlacklist = require("../models/TokenBlacklist");

async function blacklistTokenPayload(payload) {
  if (!payload?.jti || !payload?.exp) {
    return;
  }

  await TokenBlacklist.updateOne(
    { jti: payload.jti },
    {
      jti: payload.jti,
      expiresAt: new Date(payload.exp * 1000),
    },
    { upsert: true }
  );
}

async function isTokenBlacklisted(jti) {
  if (!jti) {
    return false;
  }

  const entry = await TokenBlacklist.findOne({ jti }).select("_id");
  return Boolean(entry);
}

module.exports = {
  blacklistTokenPayload,
  isTokenBlacklisted,
};
