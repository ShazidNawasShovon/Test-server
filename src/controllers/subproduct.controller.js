const { createResponse } = require("../utils/responseGenerate");
const productsModel = require("../models/SubProducts");
const { ErrorHandler } = require("../utils/error");
const { generateCode } = require("../helpers/code_generator");

module.exports.createSubproduct = async (req, res, next) => {
  const { body, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  if (body.identifier_url) {
    body.slug = body.identifier_url.split("subproducts/")[1];
  }
  try {
    const count = await productsModel.countDocuments();
    const newSubproduct = await productsModel.create({
      ...body,
      code: generateCode("SPC", count, 5),
      image: filePath,
      created_by: user.id,
    });
    res.json(createResponse(newSubproduct, "Subproduct successfully create."));
  } catch (err) {
    next(err);
  }
};

module.exports.getSubproducts = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const subproducts = await productsModel
      .find(restQuery)
      .select({ __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!subproducts) {
      res.json(createResponse(null, "Subproduct data not found!"));
    }
    const count = await productsModel.countDocuments();
    res.json(createResponse({subproducts, count}, "Subproducts successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getSubproductById = async (req, res, next) => {
  try {
    const { params } = req;
    const subproduct = await productsModel
      .findOne({ _id: params.id })
      .select({ __v: 0 });

    if (!subproduct) {
      res.status(404).json(createResponse(null, "Subproduct not found."));
      return;
    }

    res.json(createResponse(subproduct, "Subproduct successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateSubproductById = async (req, res, next) => {
  const { body, params, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  try {
    const subproduct = await productsModel.findOneAndUpdate(
      { _id: params.id },
      { ...body, image: filePath, updated_by: user.id },
      {
        new: true,
      }
    );
    if (!subproduct) {
      res.status(404).json(createResponse(null, "Subproduct not found."));
      return;
    }
    res.json(createResponse(subproduct, "Subproducts successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteSubproductById = async (req, res, next) => {
  try {
    const { params } = req;
    await productsModel.findOneAndDelete({ _id: params.id });

    res.json(
      createResponse({ id: params.id }, "Subproducts successfully deleted.")
    );
  } catch (err) {
    next(err);
  }
};
