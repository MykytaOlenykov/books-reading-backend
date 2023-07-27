const { ctrlWrapper } = require("../../helpers");

const getAll = require("./getAll");
const add = require("./add");
const deleteById = require("./deleteById");
const addReview = require("./addReview");

module.exports = {
  getAll: ctrlWrapper(getAll),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  addReview: ctrlWrapper(addReview),
};
