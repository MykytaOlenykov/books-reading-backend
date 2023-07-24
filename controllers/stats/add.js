const { DateTime } = require("luxon");

const { HttpError, createDateObj, validateTimezone } = require("../../helpers");
const { Book } = require("../../models/book");
const { Plan } = require("../../models/plan");
const { Stat } = require("../../models/stat");

const add = async (req, res) => {
  const { dateOfCreation, pagesRead, timeOfCreation, book: bookId } = req.body;
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

  const startDateObj = createDateObj(plan.startDate);

  const endDateObj = createDateObj(plan.endDate);

  const dateOfCreationObj = createDateObj(dateOfCreation);

  const currentDateObj = DateTime.local()
    .setZone(timezone)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  const durationWithStartDate = dateOfCreationObj
    .diff(startDateObj, "days")
    .toObject().days;

  console.log(durationWithStartDate);
  const durationWithEndDate = endDateObj
    .diff(dateOfCreationObj, "days")
    .toObject().days;

  const durationWithCurrentDate = dateOfCreationObj
    .setZone(timezone)
    .diff(currentDateObj, "days")
    .toObject().days;

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

  await Book.findByIdAndUpdate(book._id, {
    pagesFinished: book.pagesFinished + pagesRead,
  });

  const totalPages = plan.books.reduce(
    (acc, book) => acc + book.pagesTotal - book.pagesFinished,
    0
  );

  const pagesPerDay = Math.ceil(totalPages / durationWithEndDate);

  if (plan.stats) {
    const stats = await Stat.findOneAndUpdate(
      { owner, dateOfCreation },
      { $push: { currentDateStats: { pagesRead, timeOfCreation } } },
      { new: true }
    );

    if (stats) {
      return res.json({
        dateOfCreation: stats.dateOfCreation,
        pagesPerDay: stats.pagesPerDay,
        currentDateStats: stats.currentDateStats,
      });
    }

    const newStats = await Stat.create({
      dateOfCreation,
      pagesPerDay,
      currentDateStats: {
        pagesRead,
        timeOfCreation,
      },
      owner,
    });

    await Plan.findByIdAndUpdate(plan._id, { $push: { stats: newStats._id } });

    return res.json({
      dateOfCreation: newStats.dateOfCreation,
      pagesPerDay: newStats.pagesPerDay,
      currentDateStats: newStats.currentDateStats,
    });
  }

  const newStats = await Stat.create({
    dateOfCreation,
    pagesPerDay,
    currentDateStats: {
      pagesRead,
      timeOfCreation,
    },
    owner,
  });

  await Plan.findByIdAndUpdate(plan._id, { stats: newStats._id });

  res.json({
    dateOfCreation: newStats.dateOfCreation,
    pagesPerDay: newStats.pagesPerDay,
    currentDateStats: newStats.currentDateStats,
  });
};

module.exports = add;
