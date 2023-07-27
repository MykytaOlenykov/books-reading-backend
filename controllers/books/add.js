const { Book } = require("../../models/book");
const { HttpError } = require("../../helpers");

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { title, author } = req.body;

  const book = await Book.findOne({ owner, title, author });

  if (book) {
    throw HttpError(409, "This user already has such a book");
  }

  const result = await Book.create({ ...req.body, owner });

  res.status(201).json({
    _id: result._id,
    title: result.title,
    author: result.author,
    publishYear: result.publishYear,
    pagesTotal: result.pagesTotal,
    pagesFinished: result.pagesFinished,
    rating: result.rating,
    feedback: result.feedback,
  });
};

module.exports = add;
