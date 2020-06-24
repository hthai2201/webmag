const moment = require("moment");
const { categoryModel, postModel } = require("../models");
const postConfig = require("../config").post;
module.exports = {
  get: async (req, res) => {
    let { slug } = req.params;
    try {
      let post = await postModel
        .findOne({
          slug,
        })
        .populate("author")
        .lean();
      let relativePosts = await postModel
        .find({ $text: { $search: "chrome" }, _id: { $ne: post._id } })
        .limit(postConfig.relativePostLimit)
        .populate("category")
        .lean();

      res.render("postDetail", {
        post,
        relativePosts,
      });
    } catch (error) {
      res.render("home", {
        errors: error.toString(),
      });
    }
  },
};
