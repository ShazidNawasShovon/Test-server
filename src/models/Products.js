const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const productSchema = new Schema(
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
    identifier_url: {
      type: String,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    meta_description: {
      type: String,
      trim: true,
    },
    category_id: {
      type: objectID,
      ref: 'Categories',
    },
    category_name: {
      type: String,
      trim: true,
    },
    tags: { // comma separated string
      type: String,
    },
    image: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("Products", productSchema);
