const { differenceInCalendarDays } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");

const { Plan } = require("../../models/plan");
const { HttpError, validateTimezone } = require("../../helpers");

const changeStatus = async (req, res) => {
  const { _id: owner } = req.user;
  const { status } = req.body;
  const { timezone } = req.query;

  validateTimezone(timezone);

  const plan = await Plan.findOne({ owner });

  if (!plan) {
    throw HttpError(404);
  }

  const currentDate = utcToZonedTime(new Date(), timezone);

  if (status === "active") {
    const difference = differenceInCalendarDays(
      new Date(plan.startDate),
      currentDate
    );

    if (difference > 0) {
      throw HttpError(400, "Invalid status");
    }
  }

  if (status === "timeover") {
    const difference = differenceInCalendarDays(
      new Date(plan.endDate),
      currentDate
    );

    if (difference > 0) {
      throw HttpError(400, "Invalid status");
    }
  }

  const result = await Plan.findByIdAndUpdate(
    plan._id,
    { status },
    { new: true }
  );

  res.json({
    status: result.status,
  });
};

module.exports = changeStatus;
