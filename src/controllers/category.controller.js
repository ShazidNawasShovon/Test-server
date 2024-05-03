const { createResponse } = require("../utils/responseGenerate");
const categoriesModel = require("../models/Categories");
const { generateCode } = require("../helpers/code_generator");

module.exports.createCategory = async (req, res, next) => {
  const { body, user, file } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  try {
    const count = await categoriesModel.countDocuments();
    const newCategory = await categoriesModel.create({
      ...body,
      code: generateCode("CC", count),
      image: filePath,
      created_by: user.id,
    });
    res.json(createResponse(newCategory, "Category successfully create."));
  } catch (err) {
    next(err);
  }
};

module.exports.getCategorys = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const categories = await categoriesModel
      .find(restQuery)
      .select({ __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!categories) {
      res.json(createResponse(null, "Category data not found!"));
    }
    const count = await categoriesModel.countDocuments();
    res.json(createResponse({categories, count}, "Categorys successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getCategoryById = async (req, res, next) => {
  try {
    const { params } = req;
    const categories = await categoriesModel
      .findOne({ _id: params.id })
      .select({ __v: 0 });

    if (!categories) {
      res.status(404).json(createResponse(null, "Category not found."));
      return;
    }

    res.json(createResponse(categories, "Category successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateCategoryById = async (req, res, next) => {
  const { body, params, file, user } = req;
  const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
  try {
    const categories = await categoriesModel.findOneAndUpdate(
      { _id: params.id },
      {
        ...body,
        image: filePath,
        updated_by: user.id,
      },
      {
        new: true,
      }
    );
    if (!categories) {
      res.status(404).json(createResponse(null, "Category not found."));
      return;
    }
    res.json(createResponse(categories, "Categorys successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCategoryById = async (req, res, next) => {
  try {
    const { params } = req;
    await categoriesModel.findOneAndDelete({ _id: params.id });

    res.json(
      createResponse({ id: params.id }, "Categorys successfully deleted.")
    );
  } catch (err) {
    next(err);
  }
};
