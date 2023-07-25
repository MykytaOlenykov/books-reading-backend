const { Plan } = require("../../models/plan");
const { HttpError } = require("../../helpers");

const changeStatus = async (req, res) => {
  const { _id: owner } = req.user;
  const { status } = req.body;

  const result = await Plan.findOneAndUpdate(
    { owner },
    { status },
    { new: true }
  );

  if (!result) {
    throw HttpError(404);
  }

  res.json({
    status: result.status,
  });
};

module.exports = changeStatus;
