const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");
const { HttpError } = require("../../helpers");

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const plan = await Plan.findOne({ owner, books: { $in: [id] } });

  if (plan) {
    throw HttpError(400, "This book is included in the plan");
  }

  const result = await Book.findOneAndRemove({ _id: id, owner });

  if (!result) {
    throw HttpError(404);
  }

  res.json({
    _id: result._id,
  });
};

module.exports = deleteById;
