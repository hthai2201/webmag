const moment = require("moment");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { categoryModel, postModel, userModel } = require("../models");
const postConfig = require("../config").post;
const authenticationConfig = require("../config").authentication;
const { errorFormatter } = require("../validator");
module.exports = {
  home: async (req, res) => {
    let { limit, fromDateBefore } = req.query;
    let endDate = moment();
    let startDate = moment(endDate).subtract(
      postConfig.featuredPostDayLimit,
      "days"
    );
    startDate = startDate.toDate();
    endDate = endDate.toDate();
    let featuredPosts = await postModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate("category")
      .sort("-view")
      .limit(postConfig.featuredPostLimit)
      .lean();
    let recentPosts = await postModel
      .find()
      .populate("category")
      .sort("-createdAt")
      .limit(postConfig.recentPostLimit)
      .lean();
    let mostReadPosts = await postModel
      .find()
      .populate("category")
      .sort("-view")
      .limit(postConfig.mostReadPostLimit)
      .lean();
    let subCategories = await categoryModel
      .find({
        isRoot: {
          $ne: true,
        },
      })
      .select({ _id: 1 })
      .lean();
    let topCategoryPosts = await Promise.all(
      subCategories.map(async (category) => {
        return await postModel
          .findOne({ category: category._id })
          .populate("category")
          .lean();
      })
    );
    topCategoryPosts = topCategoryPosts.filter(Boolean);
    res.render("home", {
      featuredPosts: featuredPosts.slice(1),
      firstfeaturedPost: featuredPosts[0] || null,
      recentPosts,
      mostReadPosts,
      topCategoryPosts,
      noAsideAd: true,
    });
  },
  popular: async (req, res) => {
    let {
      page = 1,
      perPage = postConfig.featuredPostLimit,
      fromDateBefore,
    } = req.query;
    let endDate = moment();
    let startDate = moment(endDate).subtract(
      postConfig.featuredPostDayLimit,
      "days"
    );
    startDate = startDate.toDate();
    endDate = endDate.toDate();
    let popularPosts = await postModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate("category")
      .sort("-view")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
    let popularPostCount = await postModel.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    let pageCount = Math.ceil(popularPostCount / perPage) || 0;
    res.render("listPosts", {
      posts: popularPosts,
      pagination:
        pageCount > 1
          ? {
              page,
              pageCount,
            }
          : null,
    });
  },
  search: async (req, res) => {
    let {
      page = 1,
      perPage = postConfig.mostReadPostLimit,
      q = "",
      fromDateBefore,
    } = req.query;

    let searchedPosts = await postModel
      .find(
        {
          $text: {
            $search: q,
          },
        },
        { score: { $meta: "textScore" } }
      )
      .populate("category")
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    res.render("listPosts", {
      posts: searchedPosts,
    });
  },
  login: async (req, res) => {
    try {
      res.render("login");
    } catch (error) {}
  },
  login_post: async (req, res) => {
    try {
      let formError = validationResult(req);
      if (formError.isEmpty()) {
        //handle
        let { username, password } = req.body;

        let user = await userModel.findOne({ username }).lean();
        if (user) {
          let comparePasswordResult = await bcrypt.compare(
            password,
            user.password
          );
          let hash = bcrypt.hash(password, authenticationConfig.saltRounds);
          console.log(hash);
          if (comparePasswordResult) {
            let token = await jwt.sign(
              user,
              authenticationConfig.jwtPrivateKey,
              {
                expiresIn: "1m",
              }
            );
          } else {
            res.render("login", {
              formError: {
                submit: "Username or Password incorrect",
              },
            });
          }
        } else {
          res.render("login", {
            formError: {
              submit: "Username or Password incorrect",
            },
          });
        }
      } else {
        formError = formError.formatWith(errorFormatter).mapped();
        res.render("login", { formError });
      }
    } catch (error) {
      res.render("login", { error: error.toString() });
    }
  },
  register: async (req, res) => {
    try {
      res.render("register");
    } catch (error) {}
  },
};
