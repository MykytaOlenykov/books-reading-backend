const { ctrlWrapper } = require("../../helpers");

const getAll = require("./getAll");
const add = require("./add");
const deleteById = require("./deleteById");

module.exports = {
  getAll: ctrlWrapper(getAll),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
};
