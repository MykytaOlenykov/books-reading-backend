const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helpers");

const isValidId = (req, _, next) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId)) {
    return next(HttpError(400, `${bookId} is not valid id`));
  }

  next();
};

module.exports = isValidId;
