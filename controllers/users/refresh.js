const { User } = require("../../models/user");
const {
  HttpError,
  createTokens,
  verifyRefreshToken,
} = require("../../helpers");

const refresh = async (req, res) => {
  const { refreshToken: cookie } = req.cookies;
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  const id = verifyRefreshToken(token);

  const user = await User.findById(id);

  if (!user || !user.refreshToken || user.refreshToken !== token) {
    throw HttpError(401);
  }

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
    cookie,
  });
};

module.exports = refresh;
