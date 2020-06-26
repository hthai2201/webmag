const express = require("express");
const router = express.Router();
const { loginValidator } = require("../validator");
const { generalController } = require("../controllers");
const passport = require("passport");
router.get("/", generalController.home);
router.get("/popular", generalController.popular);
router.get("/search", generalController.search);
router.get("/login", generalController.login);
router.post("/login", loginValidator(), generalController.login_post);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get("/facebook/cb", generalController.facebook);
//passport.authenticate("facebook", { failureRedirect: "/login" }),
router.get("/register", generalController.register);
router.get("/logout", generalController.logout);
module.exports = router;
