const { ctrlWrapper } = require("../../helpers");

const get = require("./get");
const add = require("./add");

module.exports = {
  get: ctrlWrapper(get),
  add: ctrlWrapper(add),
};
