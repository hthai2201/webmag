const moment = require("moment");
const passport = require("passport");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { categoryModel, postModel, userModel } = require("../models");
const postConfig = require("../config").post;
const authenticationConfig = require("../config").authentication;
const { errorFormatter } = require("../validator");
module.exports = {
  home: async (req, res) => {
    console.log("home", req.user);
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
    const { user } = req;
    try {
      res.render("login");
    } catch (error) {}
  },
  facebook: async (req, res, next) => {
    passport.authenticate("facebook", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        res.cookie("token", user.token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.redirect("/");
      });
    })(req, res, next);
  },
  google: async (req, res, next) => {
    passport.authenticate("google", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        res.cookie("token", user.token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.redirect("/");
      });
    })(req, res, next);
  },
  login_post: async (req, res) => {
    let { retUrl } = req.query;
    try {
      let formError = validationResult(req);
      if (formError.isEmpty()) {
        //handle
        let { username, password } = req.body;
        console.log(username, password);
        let user = await userModel.findOne({ username });
        if (user) {
          let comparePasswordResult = await bcrypt.compare(
            password,
            user.password
          );
          console.log(user, comparePasswordResult);
          if (comparePasswordResult) {
            let token = user.token();
            console.log(token);
            res.cookie("token", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
            res.redirect(retUrl ? retUrl : "/");
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
  register_post: async (req, res) => {
    try {
      let formError = validationResult(req);
      console.log(
        new Date(req.body.dobValue),
        Date.now(req.body.dobValuex),
        moment(req.body.dobValue, "YYYY/MM/DD")
      );
      if (formError.isEmpty()) {
        let { username, email, password, dobValue, fullname } = req.body;
        let user = await userModel
          .findOne({
            username,
            email,
          })
          .lean();
        console.log(user);
        if (user) {
          res.render("register", {
            formError: {
              username: "Username not available",
            },
          });
        } else {
          let newUser = await userModel
            .create({
              username,
              email,
              password,
              dob: dobValue,
              fullname,
            })
            .lean();
          console.log(newUser);
          res.render("register");
        }
      } else {
        formError = formError.formatWith(errorFormatter).mapped();
        res.render("register", { formError });
      }
    } catch (error) {}
  },
  logout: async (req, res) => {
    req.logout();
    console.log(req.user);
    res.cookie("token", "", { maxAge: Date.now() });
    res.clearCookie("token");
    res.redirect("/");
  },
};
