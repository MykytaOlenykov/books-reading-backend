const { Plan } = require("../../models/plan");
const { HttpError } = require("../../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const plan = await Plan.findOne({ owner }).populate(
    "stats",
    "-createdAt -updatedAt -owner -plan"
  );

  if (!plan) {
    throw HttpError(404);
  }

  res.json(plan.stats);
};

module.exports = getAll;
