const moment = require("moment");
const { categoryModel, tagModel, postModel } = require("../models");
const postConfig = require("../config").post;
module.exports = {
  get: async (req, res) => {
    let { slug } = req.params;
    let { page = 1, perPage = postConfig.searchPostLimit } = req.query;
    let endDate = moment();
    let startDate = moment(endDate).subtract(
      postConfig.featuredPostDayLimit,
      "days"
    );
    startDate = startDate.toDate();
    endDate = endDate.toDate();
    try {
      let tag = await tagModel.findOne({ slug });
      let featuredPosts = await postModel
        .find({
          tags: tag._id,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate("category")
        .populate("tags")
        .sort("-view")
        .limit(postConfig.featuredPostLimit)
        .lean();

      let posts = await postModel
        .find({ tags: tag._id })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort("createdAt")
        .populate("category")
        .lean();
      let pageCount = postModel.countDocuments({
        tags: tag._id,
      });

      res.render("listPosts", {
        posts,
        featuredPosts,
        pagination:
          pageCount > 1
            ? {
                page,
                pageCount,
              }
            : null,
      });
    } catch (error) {
      res.render("listPosts", {
        errors: error.toString(),
      });
    }
  },
};
