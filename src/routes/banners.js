const router = require("express").Router();
const { upload } = require("../middlewares/imageUpload");
const {
  createBanner,
  getBanners,
  getBannerById,
  updateBannerById,
  deleteBannerById,
} = require("../controllers/banner.controller");

// Banner Routes
router.post("/api/banners", upload, createBanner);
router.get("/api/banners", getBanners);
router.get("/api/banners/:id", getBannerById);
router.put("/api/banners/:id", upload, updateBannerById);
router.delete("/api/banners/:id", deleteBannerById);

module.exports = router;
