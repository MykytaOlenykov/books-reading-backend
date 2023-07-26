const { differenceInDays } = require("date-fns");
const { zonedTimeToUtc } = require("date-fns-tz");

const calcDifferenceInDays = (startDate, endDate, timezone) => {
  const startDateUtc = zonedTimeToUtc(startDate, timezone);
  const endDateUtc = zonedTimeToUtc(endDate, timezone);

  console.log("startDateUtc", startDateUtc);
  console.log("endDateUtc", endDateUtc);

  return differenceInDays(endDateUtc, startDateUtc);
};

module.exports = calcDifferenceInDays;
