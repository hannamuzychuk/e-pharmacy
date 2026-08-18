const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    id: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    suppliers: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
  },
  { timestamps: true, versionKey: false, collection: "products" }
);

const Product = model("Product", productSchema);

module.exports = Product;
