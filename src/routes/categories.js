const router = require("express").Router();
const { upload } = require("../middlewares/imageUpload");
const {
  createCategory,
  getCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/category.controller");

// Category Routes
router.post("/api/categories", upload, createCategory);
router.get("/api/categories", getCategorys);
router.get("/api/categories/:id", getCategoryById);
router.put("/api/categories/:id", upload, updateCategoryById);
router.delete("/api/categories/:id", deleteCategoryById);

module.exports = router;
