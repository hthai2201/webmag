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
      let category = await categoryModel
        .findOne({ slug })
        .populate("subCategories");

      let categoryIds = category
        ? category.subCategories.map((item) => item._id)
        : [];
      let featuredPosts = await postModel
        .find({
          category: { $in: categoryIds },
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate("category")
        .sort("-view")
        .limit(postConfig.featuredPostLimit)
        .lean();
      let posts = await postModel
        .find({ category: { $in: categoryIds } })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort("createdAt")
        .populate("category")
        .lean();
      let pageCount = postModel.countDocuments({
        category: { $in: categoryIds },
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
