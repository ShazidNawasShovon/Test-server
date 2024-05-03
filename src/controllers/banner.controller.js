const { createResponse } = require("../utils/responseGenerate");
const bannersModel = require("../models/Banners");
const { ErrorHandler } = require("../utils/error");
const { generateCode } = require("../helpers/code_generator");

module.exports.createBanner = async (req, res, next) => {
  const { body, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  try {
    const count = await bannersModel.countDocuments();
    const newBanner = await bannersModel.create({
      ...body,
      code: generateCode("PC", count, 5),
      image: filePath,
      created_by: user.id,
    });
    res.json(createResponse(newBanner, "Banner successfully create."));
  } catch (err) {
    next(err);
  }
};

module.exports.getBanners = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const banners = await bannersModel
      .find(restQuery)
      .select({ __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!banners) {
      res.json(createResponse(null, "Banner data not found!"));
    }
    const count = await bannersModel.countDocuments();
    res.json(createResponse({banners, count}, "Banners successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getBannerById = async (req, res, next) => {
  try {
    const { params } = req;
    const banner = await bannersModel
      .findOne({ _id: params.id })
      .select({ __v: 0 });

    if (!banner) {
      res.status(404).json(createResponse(null, "Banner not found."));
      return;
    }

    res.json(createResponse(banner, "Banner successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateBannerById = async (req, res, next) => {
  const { body, params, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  try {
    const banner = await bannersModel.findOneAndUpdate(
      { _id: params.id },
      { ...body, image: filePath, updated_by: user.id },
      {
        new: true,
      }
    );
    if (!banner) {
      res.status(404).json(createResponse(null, "Banner not found."));
      return;
    }
    res.json(createResponse(banner, "Banners successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteBannerById = async (req, res, next) => {
  try {
    const { params } = req;
    await bannersModel.findOneAndDelete({ _id: params.id });

    res.json(
      createResponse({ id: params.id }, "Banners successfully deleted.")
    );
  } catch (err) {
    next(err);
  }
};
