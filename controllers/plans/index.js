const { ctrlWrapper } = require("../../helpers");

const get = require("./get");
const add = require("./add");
const finish = require("./finish");
const addStatistics = require("./addStatistics");
const changeStatus = require("./changeStatus");

module.exports = {
  get: ctrlWrapper(get),
  add: ctrlWrapper(add),
  finish: ctrlWrapper(finish),
  addStatistics: ctrlWrapper(addStatistics),
  changeStatus: ctrlWrapper(changeStatus),
};
