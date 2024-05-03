const { createResponse } = require("../utils/responseGenerate");
const productsModel = require("../models/Products");
const { ErrorHandler } = require("../utils/error");
const { generateCode } = require("../helpers/code_generator");

module.exports.createProduct = async (req, res, next) => {
  const { body, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  if (body.identifier_url) {
    body.slug = body.identifier_url.split("products/")[1];
  }
  try {
    const count = await productsModel.countDocuments();
    const newProduct = await productsModel.create({
      ...body,
      code: generateCode("PC", count, 5),
      image: filePath,
      created_by: user.id,
    });
    res.json(createResponse(newProduct, "Product successfully create."));
  } catch (err) {
    next(err);
  }
};

module.exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const products = await productsModel
      .find(restQuery)
      .select({ __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!products) {
      res.json(createResponse(null, "Product data not found!"));
    }
    const count = await productsModel.countDocuments();
    res.json(createResponse({products, count}, "Products successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const { params } = req;
    const product = await productsModel
      .findOne({ _id: params.id })
      .select({ __v: 0 });

    if (!product) {
      res.status(404).json(createResponse(null, "Product not found."));
      return;
    }

    res.json(createResponse(product, "Product successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateProductById = async (req, res, next) => {
  const { body, params, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  try {
    const product = await productsModel.findOneAndUpdate(
      { _id: params.id },
      { ...body, image: filePath, updated_by: user.id },
      {
        new: true,
      }
    );
    if (!product) {
      res.status(404).json(createResponse(null, "Product not found."));
      return;
    }
    res.json(createResponse(product, "Products successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProductById = async (req, res, next) => {
  try {
    const { params } = req;
    await productsModel.findOneAndDelete({ _id: params.id });

    res.json(
      createResponse({ id: params.id }, "Products successfully deleted.")
    );
  } catch (err) {
    next(err);
  }
};
