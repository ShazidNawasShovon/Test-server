const router = require("express").Router();
const { upload } = require("../middlewares/imageUpload");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/product.controller");

// Product Routes
router.post("/api/products", upload, createProduct);
router.get("/api/products", getProducts);
router.get("/api/products/:id", getProductById);
router.put("/api/products/:id", upload, updateProductById);
router.delete("/api/products/:id", deleteProductById);

module.exports = router;
