const { DateTime } = require("luxon");

const { HttpError, createDateObj, validateTimezone } = require("../../helpers");
const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");
const { Stat } = require("../../models/stat");

const add = async (req, res) => {
  const { date, pagesRead, time, book: bookId } = req.body;
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

  if (plan.status === "finished" || plan.status === "timeover") {
    throw HttpError(400, "plan is finished");
  }

  const startDateObj = createDateObj(plan.startDate);

  const endDateObj = createDateObj(plan.endDate);

  const dateObj = createDateObj(date);

  const currentDateObj = DateTime.local()
    .setZone(timezone)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const durationWithStartDate = dateObj
    .diff(startDateObj, "days")
    .toObject().days;

  const durationWithEndDate = endDateObj.diff(dateObj, "days").toObject().days;

  const durationWithCurrentDate = dateObj
    .setZone(timezone)
    .diff(currentDateObj, "days")
    .toObject().days;

  const isTimeover =
    endDateObj.setZone(timezone).diff(currentDateObj, "days").toObject().days <=
    0;

  if (isTimeover) {
    await Plan.findByIdAndUpdate(plan._id, { status: "timeover" });

    throw HttpError(409, "timeover");
  }

  if (
    durationWithStartDate === undefined ||
    durationWithStartDate < 0 ||
    !durationWithEndDate ||
    durationWithEndDate < 1 ||
    durationWithCurrentDate === undefined ||
    durationWithCurrentDate < 0
  ) {
    throw HttpError(400, "Invalid dates");
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

  const pagesPerDay = Math.ceil(totalPages / durationWithEndDate);

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

    return res.json({
      stats: {
        _id: newStats._id,
        date: newStats.date,
        pagesPerDay: newStats.pagesPerDay,
        currentDateStats: newStats.currentDateStats,
      },
      book: updatedBook,
      planStatus: status,
    });
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

  await Plan.findByIdAndUpdate(plan._id, { stats: newStats._id });

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
