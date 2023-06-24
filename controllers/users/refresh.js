const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");
const { HttpError, createTokens } = require("../../helpers");

const { REFRESH_TOKEN_SECRET_KEY, COOKIE_MAX_AGE, CLIENT_URL } = process.env;

const refresh = async (req, res) => {
  const { refreshToken: token } = req.signedCookies;

  if (!token) {
    throw HttpError(401);
  }

  const { id } = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);

  const user = await User.findById(id);

  if (!user || !user.refreshToken || user.refreshToken !== token) {
    throw HttpError(401);
  }

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.cookie("refreshToken", refreshToken, {
    maxAge: Number(COOKIE_MAX_AGE),
    httpOnly: true,
    signed: true,
    domain: CLIENT_URL,
    secure: true,
  });

  res.json({
    accessToken,
  });
};

module.exports = refresh;
