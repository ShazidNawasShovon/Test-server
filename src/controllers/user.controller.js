const hash = require("../helpers/password_hash");
const { createResponse } = require("../utils/responseGenerate");
const usersModel = require("../models/Users");
const { sendMail } = require("../helpers/mail");
const { ErrorHandler } = require("../utils/error");
const jwt = require("../helpers/jwt");
require("dotenv").config();

module.exports.createUser = async (req, res, next) => {
  const { body, user } = req;
  if (body.password) {
    const hashPass = await hash.new(body.password);
    body.password = hashPass;
  }
  try {
    const isExist = await usersModel.findOne({ email: body.email });
    if (isExist) {
      console.log("User is already existed.");
      throw new ErrorHandler("User is already existed.", 409);
    }
    const newUser = await usersModel.create(body);
    let token = "";
    if (newUser) {
      const payload = {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        exp: Math.floor(Date.now() / 100) + 60 * 60,
      };
      token = await jwt.encode(payload);
    }
    res.json(
      createResponse(
        { token, name: newUser.name, id: newUser._id },
        "User successfully create."
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, ...restQuery } = req.query;
    const pageNum = page ? parseInt(page, 10) : 1;
    const Limit = limit ? parseInt(limit, 10) : 10;
    const skip = Limit * (pageNum - 1);

    const users = await usersModel
      .find(restQuery)
      .select({ password: 0, __v: 0 })
      .limit(Limit)
      .skip(skip)
      .sort({ createdAt: "desc" });

    if (!users) {
      res.json(createResponse(null, "User data not found!"));
    }
    const count = await usersModel.countDocuments();
    res.json(createResponse({ users, count }, "Users successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await usersModel
      .findOne({ _id: params.id })
      .select({ password: 0, __v: 0 });

    if (!user) {
      res.status(404).json(createResponse(null, "User not found."));
      return;
    }

    res.json(createResponse(user, "User successfully retrive."));
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserById = async (req, res, next) => {
  const { body, params } = req;
  if (body.created_by) delete body.created_by;
  try {
    const user = await usersModel.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    });
    if (!user) {
      res.status(404).json(createResponse(null, "User not found."));
      return;
    }
    res.json(createResponse(null, "Users successfully updated."));
  } catch (err) {
    next(err);
  }
};

module.exports.uploadImage = async (req, res, next) => {
  const { user, file } = req;
  try {
    const filePath = file?.path.split("public")[1].replace(/\\/g, "/");
    const updateUser = await usersModel.findOneAndUpdate(
      { _id: user.id },
      { image: filePath },
      {
        new: true,
      }
    );
    if (!updateUser) {
      throw new ErrorHandler("User not found.", 404);
    }
    res.json(
      createResponse({ image: filePath }, "Users successfully updated.")
    );
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUserById = async (req, res, next) => {
  try {
    const { params } = req;
    await usersModel.findOneAndDelete({ _id: params.id });

    res.json(createResponse(null, "Users successfully deleted."));
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const { body } = req;
  try {
    const user = await usersModel.findOne({
      email: body.email,
      status: { $ne: false },
    });
    if (!user) {
      res.json(createResponse(null, "User unauthorized!."));
      // throw new ErrorHandler("User unauthorized!.", 401);
      return;
    }
    const verifyPass = await hash.verify(req.body.password, user.password);
    if (!verifyPass) {
      res.json(createResponse(null, "User info invalid!."));
      return;
      // throw new ErrorHandler("User info invalid!.", 400);
    }
    let token = "";
    if (user) {
      const payload = {
        id: user._id,
        name: user.name,
        role: user.role,
        status: user.status,
        exp: Math.floor(Date.now() / 100) + 60 * 60,
      };
      token = await jwt.encode(payload);
    }

    res.json(
      createResponse(
        { token, id: user._id, name: user.name, role: user.role },
        "User successfully login."
      )
    );
  } catch (err) {
    next(err);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await usersModel
      .findOne({ email: body.email })
      .select({ password: 0 });
    if (!user) {
      res.json(createResponse(null, "User with this email not exists."));
      return;
      // throw new ErrorHandler("User with this email not exists.", 400);
    }
    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
      company: user.company,
      status: user.status,
      exp: Math.floor(Date.now() / 100) + 60 * 60,
    };
    const token = await jwt.encode(payload);
    let mailOptions = {
      from: "myemail@gmail.com",
      to: body.email,
      subject: `The subject goes here`,
      html: `<h2>Please click on given link to reset your password.</h2>
                    <p>${process.env.CLIENT_BASE_URL}/reset-password/${token}</p>`,
    };
    const updateUser = await usersModel.updateOne(
      { resetLink: token },
      { new: true }
    );
    if (!updateUser) {
      throw new ErrorHandler("Reset password link error.", 400);
    } else {
      let mailInfo = await sendMail(mailOptions);
      if (!mailInfo) {
        throw new ErrorHandler("Mail send failed.", 500);
      }
      res.json(createResponse(null, "Mail send successfully."));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { new_password, confirm_password, reset_link } = req.body;
    if (new_password !== confirm_password) {
      throw new ErrorHandler("Password not match!.", 400);
    }
    const hashPass = await hash.new(req.body.new_password);
    if (reset_link) {
      const tokenData = await jwt.decode(reset_link);
      if (!tokenData) {
        throw new ErrorHandler("Invalid reset token!.", 400);
      }
      let user = await usersModel.findOneAndUpdate(
        {
          _id: tokenData.id,
          company: tokenData.company,
        },
        { password: hashPass },
        { new: true }
      );
      if (!user) {
        throw new ErrorHandler("User not found.", 404);
      }
      res.json(createResponse(null, "Password reset updated."));
    }
  } catch (err) {
    next(err);
  }
};
