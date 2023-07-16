const regexps = require("./regexps");

const customSchemaMessages = {
  integer: "Number must be integer",
  publishYearMatch: `publishYear should match the following ${regexps.publishYear}`,
  pagesFinishedMatch:
    "The number of pagesFinished must be less than or equal to the number of pagesTotal",
};

module.exports = customSchemaMessages;
