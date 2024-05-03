const { createResponse } = require("../utils/responseGenerate");
const attributesModel = require("../models/Attributes");
const { ErrorHandler } = require("../utils/error");
const { generateCode } = require("../helpers/code_generator");

module.exports.createAttribute = async (req, res, next) => {
  const { body, user } = req;
  try {
    const count = await attributesModel.countDocuments();
    const newAttribute = await attributesModel.create({
      ...body,
      code: generateCode("AC", count),
      created_by: user.id,
    });
    res.json(createResponse(newAttribute, "Attribute successfully create."));
  } catch (err) {
    next(err);
  }
};

module.exports.getAttributes = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const attributes = await attributesModel
      .find(restQuery)
      .select({ __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!attributes) {
      res.json(createResponse(null, "Attribute data not found!"));
    }
    const count = await attributesModel.countDocuments();
    res.json(createResponse({attributes, count}, "Attributes successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getAttributeById = async (req, res, next) => {
  try {
    const { params } = req;
    const attribute = await attributesModel
      .findOne({ _id: params.id })
      .select({ __v: 0 });

    if (!attribute) {
      res.status(404).json(createResponse(null, "Attribute not found."));
      return;
    }

    res.json(createResponse(attribute, "Attribute successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateAttributeById = async (req, res, next) => {
  const { body, params, user } = req;
  try {
    const attribute = await attributesModel.findOneAndUpdate(
      { _id: params.id },
      { ...body, updated_by: user.id },
      {
        new: true,
      }
    );
    if (!attribute) {
      res.status(404).json(createResponse(null, "Attribute not found."));
      return;
    }
    res.json(createResponse(attribute, "Attributes successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteAttributeById = async (req, res, next) => {
  try {
    const { params } = req;
    await attributesModel.findOneAndDelete({ _id: params.id });

    res.json(
      createResponse({ id: params.id }, "Attributes successfully deleted.")
    );
  } catch (err) {
    next(err);
  }
};
