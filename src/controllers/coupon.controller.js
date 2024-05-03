const { createResponse } = require("../utils/responseGenerate");
const couponsModel = require("../models/Coupons");
const { ErrorHandler } = require("../utils/error");
const { generateCode } = require("../helpers/code_generator");

module.exports.createCoupon = async (req, res, next) => {
  const { body, user } = req;
  try {
    const newCoupon = await couponsModel.create({
      ...body,
      created_by: user.id,
    });
    res.json(createResponse(newCoupon, "Coupon successfully create."));
  } catch (err) {
    next(err);
  }
};

module.exports.getCoupons = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const coupons = await couponsModel
      .find(restQuery)
      .select({ __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!coupons) {
      res.json(createResponse(null, "Coupon data not found!"));
    }
    const count = await couponsModel.countDocuments();
    res.json(createResponse({coupons, count}, "Coupons successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getCouponById = async (req, res, next) => {
  try {
    const { params } = req;
    const coupon = await couponsModel
      .findOne({ _id: params.id })
      .select({ __v: 0 });

    if (!coupon) {
      res.status(404).json(createResponse(null, "Coupon not found."));
      return;
    }

    res.json(createResponse(coupon, "Coupon successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateCouponById = async (req, res, next) => {
  const { body, params, user } = req;
  try {
    const coupon = await couponsModel.findOneAndUpdate(
      { _id: params.id },
      { ...body, updated_by: user.id },
      {
        new: true,
      }
    );
    if (!coupon) {
      res.status(404).json(createResponse(null, "Coupon not found."));
      return;
    }
    res.json(createResponse(coupon, "Coupons successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCouponById = async (req, res, next) => {
  try {
    const { params } = req;
    await couponsModel.findOneAndDelete({ _id: params.id });

    res.json(
      createResponse({ id: params.id }, "Coupons successfully deleted.")
    );
  } catch (err) {
    next(err);
  }
};
