const { DateTime } = require("luxon");

const { HttpError } = require("../../helpers");
const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");

const get = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Plan.findOne({ owner }, "-owner -createdAt -updatedAt");

  if (!result) {
    throw HttpError(404);
  }

  const endDateArr = result.endDate.split("-");

  const currentDateObj = DateTime.local().set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const endDateObj = DateTime.local(
    Number(endDateArr[0]),
    Number(endDateArr[1]),
    Number(endDateArr[2])
  );

  const duration = endDateObj.diff(currentDateObj, "days").toObject().days;

  const books = await Book.find({ _id: { $in: [...result.books] } });

  const totalPages = books.reduce(
    (acc, book) => acc + book.pagesTotal - book.pagesFinished,
    0
  );

  const pagesPerDay = Math.ceil(totalPages / duration);

  res.json({
    _id: result._id,
    startDate: result.startDate,
    endDate: result.endDate,
    books: result.books,
    pagesPerDay,
  });
};

module.exports = get;
