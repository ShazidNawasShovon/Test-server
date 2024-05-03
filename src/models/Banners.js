const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const bannerSchema = new Schema(
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
    page: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("Banners", bannerSchema);
