const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");
const { HttpError } = require("../../helpers");

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { bookId } = req.params;

  const result = await Book.findByIdAndRemove(bookId);

  if (!result) {
    throw HttpError(404);
  }

  const plan = await Plan.findOne({ owner, books: { $in: [bookId] } });

  if (plan) {
    throw HttpError(400, "This book is included in the plan");
  }

  res.json({
    _id: result._id,
  });
};

module.exports = deleteById;
