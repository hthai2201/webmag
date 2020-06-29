const moment = require("moment");
const { categoryModel, postModel, commentModel } = require("../models");
const postConfig = require("../config").post;
module.exports = {
  get: async (req, res) => {
    let { slug } = req.params;
    try {
      let post = await postModel
        .findOne({
          slug,
        })
        .populate([
          "author",
          {
            path: "comments",
            populate: [
              "user",
              {
                path: "replyComments",
                populate: "user",
              },
            ],
          },
        ]);

      post.view = post.view + 1 || 1;
      await post.save();
      post = post.toObject();
      let relativePosts = await postModel
        .find({ $text: { $search: "chrome" }, _id: { $ne: post._id } })
        .limit(postConfig.relativePostLimit)
        .populate("category")
        .lean();
      console.log(post.comments[0].replyComments);
      res.render("postDetail", {
        post,
        relativePosts,
      });
    } catch (error) {
      res.render("postDetail", {
        errors: error.toString(),
      });
    }
  },
  like: async (req, res) => {
    console.log("runnnnnn");
    try {
      let { slug } = req.params;
      let { user } = req;

      let post = slug ? await postModel.findOne({ slug }) : {};
      post.like = post.like ? post.like : [];
      if (!post.like.includes(user._id)) {
        post.like.push(user._id);
      }
      console.log("runnnnnnn");
      console.log(post.like);
      await post.save();

      res.redirect(`./`);
    } catch (error) {
      console.log(error.toString());
      res.render("postDetail", {
        errors: error.toString(),
      });
    }
  },
  comment: async (req, res) => {
    try {
      let { slug } = req.params;
      let { user } = req;
      let { content, replyCommentId } = req.body;

      let post = slug ? await postModel.findOne({ slug }) : null;
      if (post) {
        let comment = new commentModel({ content, user: user._id });
        await comment.save();
        if (replyCommentId) {
          let parentComent = await commentModel.findById(replyCommentId);
          await parentComent.addRefs("replyComments", comment._id);
        }
      }

      res.redirect(`./`);
    } catch (error) {
      console.log(error.toString());
      res.render("postDetail", {
        errors: error.toString(),
      });
    }
  },
};
