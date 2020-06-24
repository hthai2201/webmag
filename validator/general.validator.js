const { check, validationResult } = require("express-validator");

const loginValidator = () => {
  return [
    //empty
    check("username", "Username does not Empty").not().isEmpty(),
    check("password", "Password does not Empty").not().isEmpty(),
    check("password", "Password more than 6 degits").isLength({ min: 3 }),
  ];
};
module.exports = {
  loginValidator,
};
