const gerneralValidator = require("./general.validator");
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${location}[${param}]: ${msg}`;
};
module.exports = { errorFormatter, ...gerneralValidator };
