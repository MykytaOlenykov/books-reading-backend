const { DateTime } = require("luxon");

const HttpError = require("./HttpError");

const validateTimezone = (timezone) => {
  if (!timezone || !DateTime.local().setZone(timezone).isValid) {
    throw HttpError(400, "Invalid timezone");
  }
};

module.exports = validateTimezone;
