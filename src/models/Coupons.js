const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
    },
    discount_country: {
      type: String,
      trim: true,
    },
    discount_type: {
      type: String,
      enum: ["Free Shipping", "Percentage", "Fixed Amount"],
      trim: true,
    },
    discount_value: {
      type: Number,
      min: 0,
      default: 0,
    },
    limit: {
      type: Number,
      min: 1,
      default: 1,
    },
    apply_automatically: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Coupons", couponSchema);
