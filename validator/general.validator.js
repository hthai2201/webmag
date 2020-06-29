const { check, validationResult } = require("express-validator");

const loginValidator = () => {
  return [
    //empty
    check("username", "Username does not Empty").not().isEmpty(),
    check("password", "Password does not Empty").not().isEmpty(),
  ];
};
const registerValidator = () => {
  return [
    //transform
    // check("dobValue").toDate(),
    //empty
    check("username", "Username does not Empty").not().isEmpty(),
    check("password", "Password does not Empty").not().isEmpty(),
    check("email", "Email does not Empty").not().isEmpty(),
    check("fullname", "Fullname does not Empty").not().isEmpty(),
    check("dobValue", "Dob does not Empty").not().isEmpty(),
    //more
    check("username", "Username more than 6 degits").isLength({ min: 6 }),
    check("password", "Password more than 6 degits").isLength({ min: 6 }),
    check("email", "Email invalid").isEmail(),
  ];
};
module.exports = {
  loginValidator,
  registerValidator,
};
