const moment = require("moment");
const { categoryModel, tagModel, postModel } = require("../models");
const postConfig = require("../config").post;
module.exports = {
  get: async (req, res) => {
    let { user } = req;
    console.log(user);
    try {
      res.render("users/profile", {
        errors: error.toString(),
      });
    } catch (error) {
      res.render("users/profile", {
        errors: error.toString(),
      });
    }
  },
};
