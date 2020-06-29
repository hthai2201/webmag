const { userModel } = require("./../models");
const jwt = require("jsonwebtoken");
const authenticationConfig = require("./../config").authentication;
const parseTokenToUser = async (req, res, next) => {
  if (!req.user) {
    let { token } = req.cookies;
    if (token) {
      try {
        console.log(token);
        var decoded = jwt.verify(token, authenticationConfig.jwtPrivateKey);
        let user = await userModel.findById(decoded.id).lean();
        req.user = user;
      } catch (error) {}
    }
  }
  next();
};
const needUser = (roles) => (req, res, next) => {
  if (req.user) {
    if (req.user.role && roles && roles.length) {
      if (roles.includes(req.user.role)) {
        next();
      }
    } else {
      next();
    }
  } else {
    res.redirect(`/login?retUrl=${req.originalUrl}`);
  }
};
module.exports = {
  parseTokenToUser,
  needUser,
};
