const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectID = Schema.ObjectId;
mongoose.Promise = global.Promise;

const attributeSchema = new Schema(
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
    terms: { // comma separated string
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

module.exports = mongoose.model("Attributes", attributeSchema);
