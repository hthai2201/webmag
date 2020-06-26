const passport = require("passport");
const passportFacebook = require("passport-facebook");
const { to } = require("await-to-js");
const { getUserByProviderId, createUser } = require("../../models");
const { userModel } = require("../../models");
const FacebookStrategy = passportFacebook.Strategy;

const strategy = (app) => {
  const strategyOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/facebook/cb`,
    profileFields: ["id", "displayName", "name", "emails", "photos"],
  };

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    let { id, email, first_name, last_name, picture } = profile._json;

    let user = await userModel.oAuthLogin({
      service: "facebook",
      id,
      email,
      fullname: `${first_name} ${last_name}`,
      avatar: picture.data,
    });

    return done(null, user);
  };

  passport.use(new FacebookStrategy(strategyOptions, verifyCallback));

  return app;
};

module.exports = strategy;
