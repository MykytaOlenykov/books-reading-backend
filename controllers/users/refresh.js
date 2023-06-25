const { User } = require("../../models/user");
const {
  HttpError,
  createTokens,
  verifyRefreshToken,
} = require("../../helpers");

const maxAge = Number(process.env.MAX_AGE);

const refresh = async (req, res) => {
  const { refreshToken: token } = req.cookies;
  // const { authorization = "" } = req.headers;
  // const [bearer, token] = authorization.split(" ");

  // if (bearer !== "Bearer") {
  //   throw HttpError(401);
  // }

  const id = verifyRefreshToken(token);

  const user = await User.findById(id);

  if (!user || !user.refreshToken || user.refreshToken !== token) {
    throw HttpError(401);
  }

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge,
  });

  res.json({
    accessToken,
    refreshToken,
  });
};

module.exports = refresh;
