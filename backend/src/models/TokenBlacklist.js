const { Schema, model } = require("mongoose");

const tokenBlacklistSchema = new Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "token_blacklist",
  }
);

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TokenBlacklist = model("TokenBlacklist", tokenBlacklistSchema);

module.exports = TokenBlacklist;
