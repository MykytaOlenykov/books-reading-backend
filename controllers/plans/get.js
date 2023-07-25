const { DateTime } = require("luxon");

const { HttpError, createDateObj, validateTimezone } = require("../../helpers");
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

  if (plan.status === "finished" || plan.status === "timeover") {
    return res.json({
      _id: plan._id,
      startDate: plan.startDate,
      endDate: plan.endDate,
      books: plan.books,
      stats: plan.stats,
      status: plan.status,
      pagesPerDay: 0,
    });
  }

  const currentDateObj = DateTime.local().setZone(timezone).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const endDateObj = createDateObj(plan.endDate).setZone(timezone);

  const duration = endDateObj.diff(currentDateObj, "days").toObject().days;

  if (!duration || duration <= 0) {
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

  const pagesPerDay = Math.ceil(totalPages / duration);

  res.json({
    _id: plan._id,
    startDate: plan.startDate,
    endDate: plan.endDate,
    books: plan.books,
    stats: plan.stats,
    status: plan.status,
    pagesPerDay,
  });
};

module.exports = get;
