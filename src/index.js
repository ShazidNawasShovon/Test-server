const express = require("express");
const app = express();
const db = require("./db/db");
const logger = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errors");
const cors = require("cors");
require("./helpers/create_admin");
const { createResponse } = require("./utils/responseGenerate");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", auth.authorize);
app.use(logger("dev"));
app.use(helmet());
app.use(routes);
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send(createResponse(false, "Hello World!"));
});

app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404).send(createResponse(true, "Not Found!"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server listening on http://127.0.0.1:${PORT}`);
});

module.exports = app;
