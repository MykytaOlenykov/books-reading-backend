const { differenceInCalendarDays } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");

const { HttpError, validateTimezone } = require("../../helpers");
const { Plan } = require("../../models/plan");

const get = async (req, res) => {
  const { _id: owner } = req.user;
  const { timezone } = req.query;

  validateTimezone(timezone);

  const plan = await Plan.findOne({ owner }).populate(
    "books stats",
    "-createdAt -updatedAt -owner"
  );

  if (!plan) {
    throw HttpError(404);
  }

  const planResObj = {
    _id: plan._id,
    startDate: plan.startDate,
    endDate: plan.endDate,
    books: plan.books,
    stats: plan.stats,
    status: plan.status,
  };

  if (plan.status === "finished" || plan.status === "timeover") {
    return res.json({
      ...planResObj,
      pagesPerDay: 0,
    });
  }

  const currentDate = utcToZonedTime(new Date(), timezone);

  const difference = differenceInCalendarDays(
    new Date(plan.endDate),
    currentDate
  );

  if (difference <= 0) {
    const result = await Plan.findByIdAndUpdate(
      plan._id,
      { status: "timeover" },
      { new: true }
    ).populate("books stats", "-createdAt -updatedAt -owner");

    return res.json({
      _id: result._id,
      startDate: result.startDate,
      endDate: result.endDate,
      books: result.books,
      stats: result.stats,
      status: result.status,
      pagesPerDay: 0,
    });
  }

  const totalPages = plan.books.reduce(
    (acc, book) => acc + book.pagesTotal - book.pagesFinished,
    0
  );

  const pagesPerDay = Math.ceil(totalPages / difference);

  res.json({
    ...planResObj,
    pagesPerDay,
  });
};

module.exports = get;
