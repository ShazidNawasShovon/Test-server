const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const orderSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
    },
    products: {
      type: [{
        product_id: {
          type: objectID,
          ref: "SubProducts",
        },
        price: {
          type: Number,
          min: 0,
          default: 0,
        },
        quantity: {
          type: Number,
          min: 0,
          default: 0,
        },
        total: {
          type: Number,
          min: 0,
          default: 0,
        },
      }],
    },
    customer: {
      type: objectID,
      ref: 'User',
    },
    billing_details: {
      type: Object,
    },
    coupon: {
      type: objectID,
      ref: 'Coupons',
    },
    shipping_details: {
      type: Object,
    },
    sub_total: {
      type: Number,
      min: 1
    },
    total: {
      type: Number,
      min: 1
    },
    payment_type: {
      type: String,
      enum: ["COD", "CARD", "ACH/WT"],
    },
    order_status: {
      type: String,
      enum: ["Completed", "Processing", "Failed"],
    },
    created_by: {
      type: objectID,
      ref: 'User',
    },
    updated_by: {
      type: objectID,
      ref: 'User',
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

module.exports = mongoose.model("Orders", orderSchema);
