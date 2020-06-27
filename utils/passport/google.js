const passport = require("passport");
const passportGoogle = require("passport-google-oauth20");
const { to } = require("await-to-js");
const { getUserByProviderId, createUser } = require("../../models");
const { userModel } = require("../../models");
const GoogleStrategy = passportGoogle.Strategy;

const strategy = (app) => {
  const strategyOptions = {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/google/cb`,
    profileFields: [
      "id",
      "profileUrl",
      "displayName",
      "name",
      "emails",
      "photos",
    ],
  };

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    let { sub: id, email, name: fullname, picture: avatar } = profile._json;
    console.log(profile);
    console.log(id);
    let user = await userModel.oAuthLogin({
      service: "google",
      id,
      email,
      fullname,
      avatar,
    });

    return done(null, user);
  };

  passport.use(new GoogleStrategy(strategyOptions, verifyCallback));

  return app;
};

module.exports = strategy;
