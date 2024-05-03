const router = require("express").Router();
const {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttributeById,
  deleteAttributeById,
} = require("../controllers/attribute.controller");

// Attribute Routes
router.post("/api/attributes", createAttribute);
router.get("/api/attributes", getAttributes);
router.get("/api/attributes/:id", getAttributeById);
router.put("/api/attributes/:id", updateAttributeById);
router.delete("/api/attributes/:id", deleteAttributeById);

module.exports = router;
