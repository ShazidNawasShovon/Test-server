const router = require("express").Router();
const { upload } = require("../middlewares/imageUpload");
const {
  createSubproduct,
  getSubproducts,
  getSubproductById,
  updateSubproductById,
  deleteSubproductById,
} = require("../controllers/subproduct.controller");

// Subproduct Routes
router.post("/api/subproducts", upload, createSubproduct);
router.get("/api/subproducts", getSubproducts);
router.get("/api/subproducts/:id", getSubproductById);
router.put("/api/subproducts/:id", upload, updateSubproductById);
router.delete("/api/subproducts/:id", deleteSubproductById);

module.exports = router;

