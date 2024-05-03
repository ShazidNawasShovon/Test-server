const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const wholeselerProductsMappingSchema = new Schema(
  {
    wholeseler_id: {
      type: objectID,
      ref: "Users",
    },
    wholeseler_name: {
      type: String,
      trim: true,
    },
    products: {
      type: [
        {
          product_id: {
            type: objectID,
            ref: "SubProducts",
          },
          product_name: {
            type: String,
            trim: true,
          },
          price: {
            type: Number,
            min: 0,
            default: 0,
          },
        },
      ],
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
      default: "Active",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model(
  "WholeselerProductsMapping",
  wholeselerProductsMappingSchema
);
