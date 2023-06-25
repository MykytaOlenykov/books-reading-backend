const { User } = require("../../models/user");
const {
  HttpError,
  createTokens,
  verifyRefreshToken,
} = require("../../helpers");
const { cookieConfig } = require("../../configs");

const refresh = async (req, res) => {
  const { refreshToken: token } = req.cookies;

  const id = verifyRefreshToken(token);

  const user = await User.findById(id);

  if (!user || !user.refreshToken || user.refreshToken !== token) {
    throw HttpError(401);
  }

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.cookie("refreshToken", refreshToken, cookieConfig);

  res.json({
    accessToken,
  });
};

module.exports = refresh;
