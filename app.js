const express = require("express");
const cookieParser = require("cookie-parser");

require("express-async-errors");
const router = require("./routes");
const app = express();
const db = require("./utils/db");
const passport = require("./utils/passport");
//env
require("dotenv").config();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", express.static("public"));
app.use(cookieParser());
require("./middlewares/session.mdw")(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);
// enable authentication
passport(app);
//db
db.connect();
//router
app.use(router);
app.use(require("./middlewares/auth.mdw").parseTokenToUser);
app.get("/err", function (req, res) {
  throw new Error("beng beng");
});

app.use(function (req, res) {
  res.render("404", { layout: false });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("500", { layout: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {});
