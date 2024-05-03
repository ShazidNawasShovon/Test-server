const router = require("express").Router();
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
} = require("../controllers/coupon.controller");

// Coupon Routes
router.post("/api/coupons", createCoupon);
router.get("/api/coupons", getCoupons);
router.get("/api/coupons/:id", getCouponById);
router.put("/api/coupons/:id", updateCouponById);
router.delete("/api/coupons/:id", deleteCouponById);

module.exports = router;
