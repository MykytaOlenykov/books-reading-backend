const { User } = require("../../models/user");
const { createTokens } = require("../../helpers");

const refresh = async (req, res) => {
  const { _id } = req.user;

  const { accessToken, refreshToken } = createTokens(_id);

  await User.findByIdAndUpdate(_id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
  });
};

module.exports = refresh;
