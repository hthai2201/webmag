const LRU = require("lru-cache");
const { categoryModel, tagModel, postModel } = require("./../models");
const postConfig = require("./../config").post;
const cache = new LRU({
  max: 500,
  maxAge: 1000 * 60,
});
module.exports = function (app) {
  app.use(function (req, res, next) {
    if (req.session.isAuthenticated === null) {
      req.session.isAuthenticated = false;
    }

    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;
    next();
  });
  app.use(function (req, res, next) {
    if (req.session.isAuthenticated === null) {
      req.session.isAuthenticated = false;
    }

    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;
    next();
  });
  app.use(async function (req, res, next) {
    let categories = cache.get("categories");
    let tags = cache.get("tags");
    let mostReadPosts = cache.get("mostReadPosts");

    if (!categories) {
      categories = await categoryModel.find({ isRoot: true }).lean();
      cache.set("categories", categories);
    }
    if (!tags) {
      tags = await tagModel.find().lean();
      cache.set("tags", tags);
    }
    if (!mostReadPosts) {
      mostReadPosts = await postModel
        .find()
        .sort("-view")
        .limit(postConfig.asidePostLimit)
        .lean();
      cache.set("mostReadPosts", mostReadPosts);
    }
    res.locals.categories = categories;
    res.locals.tags = tags;
    res.locals.mostReadPosts = mostReadPosts;
    next();
  });
};
