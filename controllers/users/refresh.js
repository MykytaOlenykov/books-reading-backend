const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");
const { HttpError, createTokens } = require("../../helpers");

const { REFRESH_TOKEN_SECRET_KEY } = process.env;

const refresh = async (req, res) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  const { id } = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);

  const user = await User.findById(id);

  if (!user || !user.refreshToken || user.refreshToken !== token) {
    console.log("mnogo proverok");
    throw HttpError(401);
  }

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
  });
};

module.exports = refresh;
