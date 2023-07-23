const { DateTime } = require("luxon");

const { HttpError } = require("../../helpers");
const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");

const add = async (req, res) => {
  const { startDate, endDate, books: booksIds, timezone } = req.body;
  const { _id: owner } = req.user;

  const plan = await Plan.findOne({ owner });

  if (plan) {
    throw HttpError(409, "This user has a plan created.");
  }

  const startDateArr = startDate.split("-");
  const endDateArr = endDate.split("-");

  const currentDateObj = DateTime.local()
    .setZone(timezone)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const startDateObj = DateTime.local(
    Number(startDateArr[0]),
    Number(startDateArr[1]),
    Number(startDateArr[2])
  );

  const durationWithCurrentDate = startDateObj
    .setZone(timezone)
    .diff(currentDateObj, "days")
    .toObject().days;

  if (durationWithCurrentDate === undefined || durationWithCurrentDate < 0) {
    throw HttpError(400, "Invalid dates");
  }

  const endDateObj = DateTime.local(
    Number(endDateArr[0]),
    Number(endDateArr[1]),
    Number(endDateArr[2])
  );

  const duration = endDateObj.diff(startDateObj, "days").toObject().days;

  if (!duration || duration < 1) {
    throw HttpError(400, "Invalid dates");
  }

  const books = await Book.find({ _id: { $in: [...booksIds] } });

  if (books.length !== booksIds.length) {
    throw HttpError(400, "Invalid 'bookId'");
  }

  const totalPages = books.reduce((acc, book) => {
    if (book.pagesTotal === book.pagesFinished) {
      throw HttpError(
        400,
        "Invalid 'bookId', you can't add books that you've already read"
      );
    }

    return acc + book.pagesTotal - book.pagesFinished;
  }, 0);

  const pagesPerDay = Math.ceil(totalPages / duration);

  await Plan.create({
    startDate,
    endDate,
    books,
    owner,
  });

  const newPlan = await Plan.findOne({ owner }).populate(
    "books",
    "-createdAt -updatedAt -owner"
  );

  return res.status(201).send({
    _id: newPlan._id,
    startDate: newPlan.startDate,
    endDate: newPlan.endDate,
    books: newPlan.books,
    pagesPerDay,
  });
};

module.exports = add;
