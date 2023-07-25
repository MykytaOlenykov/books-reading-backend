const { ctrlWrapper } = require("../../helpers");

const get = require("./get");
const add = require("./add");
const finish = require("./finish");
const addStats = require("./addStats");

module.exports = {
  get: ctrlWrapper(get),
  add: ctrlWrapper(add),
  finish: ctrlWrapper(finish),
  addStats: ctrlWrapper(addStats),
};
