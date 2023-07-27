const { differenceInCalendarDays } = require("date-fns");
const { utcToZonedTime, format } = require("date-fns-tz");

const { HttpError, validateTimezone } = require("../../helpers");
const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");
const { Stat } = require("../../models/stat");

const add = async (req, res) => {
  const { pagesRead, book: bookId } = req.body;
  const { _id: owner } = req.user;
  const { timezone } = req.query;

  validateTimezone(timezone);

  const plan = await Plan.findOne({ owner }).populate(
    "books",
    "-createdAt -updatedAt -owner"
  );

  if (!plan) {
    throw HttpError(404);
  }

  if (plan.status !== "active") {
    throw HttpError(400, "plan is not active");
  }

  const currentDate = utcToZonedTime(new Date(), timezone);

  const date = format(currentDate, "yyyy-MM-dd");
  const time = format(currentDate, "HH-mm-ss");

  const differenceWithEndDate = differenceInCalendarDays(
    new Date(plan.endDate),
    currentDate
  );

  if (differenceWithEndDate <= 0) {
    await Plan.findByIdAndUpdate(plan._id, { status: "timeover" });

    throw HttpError(409, "timeover");
  }

  const book = await Book.findOne({ _id: bookId, owner });

  if (!book) {
    throw HttpError(400, "Invalid book id");
  }

  if (book.pagesFinished + pagesRead > book.pagesTotal) {
    throw HttpError(400, "Invalid pagesRead");
  }

  const totalPages = plan.books.reduce(
    (acc, book) => acc + book.pagesTotal - book.pagesFinished,
    0
  );

  const pagesPerDay = Math.ceil(totalPages / differenceWithEndDate);

  const updatedBook = await Book.findByIdAndUpdate(
    book._id,
    {
      pagesFinished: book.pagesFinished + pagesRead,
    },
    { new: true }
  ).select("-createdAt -updatedAt -owner");

  const isFinishedBook = updatedBook.pagesTotal === updatedBook.pagesFinished;

  const { books } = await Plan.findById(plan._id).populate(
    "books",
    "-createdAt -updatedAt -owner"
  );

  const isFinishedPlan =
    books.reduce(
      (acc, book) => acc + book.pagesTotal - book.pagesFinished,
      0
    ) === 0;

  if (isFinishedPlan) {
    await Plan.findByIdAndUpdate(plan._id, { status: "finished" });
  }

  const { status } = await Plan.findById(plan._id);

  if (plan.stats.length) {
    const stats = await Stat.findOneAndUpdate(
      { owner, date, _id: { $in: [...plan.stats] } },
      {
        $push: {
          currentDateStats: { pagesRead, time, book: bookId, isFinishedBook },
        },
      },
      { new: true }
    ).select("-createdAt -updatedAt -owner");

    if (stats) {
      return res.json({
        stats,
        book: updatedBook,
        planStatus: status,
      });
    }
  }

  const newStats = await Stat.create({
    date,
    pagesPerDay,
    currentDateStats: {
      pagesRead,
      time,
      book: bookId,
      isFinishedBook,
    },
    owner,
  });

  await Plan.findByIdAndUpdate(plan._id, { $push: { stats: newStats._id } });

  res.json({
    stats: {
      _id: newStats._id,
      date: newStats.date,
      pagesPerDay: newStats.pagesPerDay,
      currentDateStats: newStats.currentDateStats,
    },
    book: updatedBook,
    planStatus: status,
  });
};

module.exports = add;
