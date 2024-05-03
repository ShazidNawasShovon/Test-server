const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const subProductSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
    },
    product_id: {
      type: objectID,
      ref: "Product",
    },
    attribute: {
      type: Object,
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    discount_price: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      trim: true,
    },
    created_by: {
      type: objectID,
      ref: "User",
    },
    updated_by: {
      type: objectID,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: 'Active',
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("SubProducts", subProductSchema);
