const { DateTime } = require("luxon");

const createDateObj = (date) => {
  const dateArr = date.split("-");

  return DateTime.local(
    Number(dateArr[0]),
    Number(dateArr[1]),
    Number(dateArr[2])
  );
};

module.exports = createDateObj;
