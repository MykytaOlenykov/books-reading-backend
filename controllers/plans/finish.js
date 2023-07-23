const { Plan } = require("../../models/plan");
const { HttpError } = require("../../helpers");

const finish = async (req, res) => {
  const { _id: owner } = req.user;

  const plan = await Plan.findOneAndRemove({ owner });

  if (!plan) {
    throw HttpError(404);
  }

  res.status(204).send();
};

module.exports = finish;
