const { ctrlWrapper } = require("../../helpers");

const get = require("./get");
const add = require("./add");
const finish = require("./finish");

module.exports = {
  get: ctrlWrapper(get),
  add: ctrlWrapper(add),
  finish: ctrlWrapper(finish),
};
