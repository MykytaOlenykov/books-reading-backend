const { differenceInDays, addHours } = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

const { HttpError, validateTimezone } = require("../../helpers");
const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");

const add = async (req, res) => {
  const { startDate, endDate, books: booksIds } = req.body;
  const { _id: owner } = req.user;
  const { timezone } = req.query;

  validateTimezone(timezone);

  const plan = await Plan.findOne({ owner });

  if (plan) {
    throw HttpError(409, "This user has a plan created.");
  }

  const currentDate = utcToZonedTime(new Date(), timezone);

  const differenceWithCurrentDate = differenceInDays(
    new Date(startDate),
    currentDate
  );

  const difference = differenceInDays(new Date(endDate), new Date(startDate));

  console.log("currentDate", currentDate);
  console.log("startDate", new Date(startDate));
  console.log("endDate", new Date(endDate));

  console.log("differenceWithCurrentDate", differenceWithCurrentDate);

  console.log("difference", difference);

  const planStatus = differenceWithCurrentDate <= 0 ? "active" : "idle";

  if (differenceWithCurrentDate < 0 || difference < 1) {
    throw HttpError(400, "Invalid dates");
  }

  const books = await Book.find({ _id: { $in: [...booksIds] }, owner });

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

  const pagesPerDay = Math.ceil(totalPages / difference);

  await Plan.create({
    startDate,
    endDate,
    books,
    owner,
    status: planStatus,
  });

  const newPlan = await Plan.findOne({ owner }).populate(
    "books stats",
    "-createdAt -updatedAt -owner"
  );

  return res.status(201).send({
    _id: newPlan._id,
    startDate: newPlan.startDate,
    endDate: newPlan.endDate,
    books: newPlan.books,
    stats: newPlan.stats,
    status: newPlan.status,
    pagesPerDay,
  });
};

module.exports = add;
