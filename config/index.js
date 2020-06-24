const defaultConfig = require("./default.json");
const node_env = process.env.NODE_ENV || "development";
module.exports = {
  ...defaultConfig.common,
  ...defaultConfig["development"],
};
