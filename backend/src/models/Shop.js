const { Schema, model } = require("mongoose");

const shopSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    streetAddress: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    hasDelivery: {
      type: Boolean,
      required: true,
      default: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

const Shop = model("Shop", shopSchema);

module.exports = Shop;
