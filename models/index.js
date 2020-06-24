const categoryModel = require("./category.model");
const postModel = require("./post.model");
const commentModel = require("./comment.model");
const roleModel = require("./role.model");
const tagModel = require("./tag.model");
const userModel = require("./user.model");
const passwordResetTokenModel = require("./passwordResetToken.model");
const refreshTokenModel = require("./refreshToken.model");
module.exports = {
  categoryModel,
  postModel,
  commentModel,
  roleModel,
  tagModel,
  userModel,
  passwordResetTokenModel,
  refreshTokenModel,
};
