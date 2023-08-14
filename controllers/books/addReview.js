const { Book } = require("../../models/book");
const { HttpError } = require("../../helpers");

const addReview = async (req, res) => {
  const { _id: owner } = req.user;
  const { id: _id } = req.params;

  const book = await Book.findOne({ _id, owner });

  if (!book) {
    throw HttpError(404);
  }

  if (book.pagesTotal !== book.pagesFinished) {
    throw HttpError(400, "this book is not finished");
  }

  const updatedBook = await Book.findOneAndUpdate({ _id, owner }, req.body, {
    new: true,
  }).select("-createdAt -updatedAt -owner");

  res.json(updatedBook);
};

module.exports = addReview;
