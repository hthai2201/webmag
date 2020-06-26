const { userModel } = require("./../models");
const jwt = require("jsonwebtoken");
const authenticationConfig = require("./../config").authentication;
const parseTokenToUser = async (req, res, next) => {
  if (!req.user) {
    console.log("notuser");
    let { token } = req.cookies;
    var decoded = jwt.verify(token, authenticationConfig.jwtPrivateKey);
    let user = userModel.findById(decoded.id).lean();
    req.user = user;
  } else {
    let { token } = req.cookies;
    console.log("hasUser", token);
  }
};
module.exports = {
  parseTokenToUser,
};
// module.exports = function (req, res, next) {
//   if (!req.session.isAuthenticated) {
//     return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
//   }

//   next();
// };
