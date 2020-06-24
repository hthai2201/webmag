const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongodbConfig = require("./../config").mongodb;
mongoose.set("debug", true);
exports.connect = () => {
  mongoose
    .connect(mongodbConfig.url, {
      useCreateIndex: true,
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log(`mongoDB ${mongodbConfig.url} connected...`));
  return mongoose.connection;
};
