const { utcToZonedTime, format } = require("date-fns-tz");

const { Plan } = require("../../models/plan");
const { History } = require("../../models/history");
const { HttpError, validateTimezone } = require("../../helpers");

const finish = async (req, res) => {
  const { _id: owner } = req.user;
  const { timezone } = req.query;

  validateTimezone(timezone);

  const plan = await Plan.findOne({ owner });

  if (!plan) {
    throw HttpError(404);
  }

  if (plan.status === "idle") {
    await Plan.findByIdAndRemove(plan._id);

    return res.status(204).send();
  }

  const completionDate = format(
    utcToZonedTime(new Date(), timezone),
    "yyyy-MM-dd"
  );

  const status = plan.status === "active" ? "cancel" : plan.status;

  await History.create({
    startDate: plan.startDate,
    endDate: plan.endDate,
    completionDate,
    status,
    stats: plan.stats,
    owner,
  });

  await Plan.findByIdAndRemove(plan._id);

  res.status(204).send();
};

module.exports = finish;
