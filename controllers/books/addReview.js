const { Book } = require("../../models/book");
const { HttpError } = require("../../helpers");

const addReview = async (req, res) => {
  const { _id: owner } = req.user;
  const { bookId: _id } = req.params;

  const book = await Book.findOneAndUpdate(
    { _id, owner },
    { ...req.body },
    { new: true }
  ).select("-createdAt -updatedAt -owner");

  if (!book) {
    throw HttpError(404);
  }

  if (book.pagesTotal !== book.pagesFinished) {
    throw HttpError(400, "this book is not finished");
  }

  res.json(book);
};

module.exports = addReview;
