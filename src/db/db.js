const mongoose = require("mongoose");
require("dotenv").config();

// let dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
let dbUrl = process.env.MONGODB_URI;

if (!dbUrl) {
  _log("Mongo url not set in env file", "red");
  return new Error("Mongo url not set in env file");
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log(`Connected to DB server. ( ${process.env.NODE_ENV} )`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose;
