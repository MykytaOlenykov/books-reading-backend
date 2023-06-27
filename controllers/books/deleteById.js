const { Book } = require("../../models/book");
const { HttpError } = require("../../helpers");

const deleteById = async (req, res) => {
  const { bookId } = req.params;

  const result = await Book.findByIdAndRemove(bookId);

  if (!result) {
    throw HttpError(404);
  }

  res.json({
    _id: result._id,
  });
};

module.exports = deleteById;
