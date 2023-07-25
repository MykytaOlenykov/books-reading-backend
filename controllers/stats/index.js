const { ctrlWrapper } = require("../../helpers");

const add = require("./add");

module.exports = {
  add: ctrlWrapper(add),
};
