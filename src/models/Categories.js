const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const categorySchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discount_type: {
      type: String,
      enum: ["Percentage", "Fixed Amount"],
      trim: true,
    },
    discount_value: {
      type: Number,
      min: 0,
      default: 0,
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

module.exports = mongoose.model("Categories", categorySchema);
