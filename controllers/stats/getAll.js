const { Plan } = require("../../models/plan");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const plan = await Plan.findOne({ owner }).populate(
    "stats",
    "-createdAt -updatedAt -owner -plan"
  );

  res.json(plan.stats);
};

module.exports = getAll;
