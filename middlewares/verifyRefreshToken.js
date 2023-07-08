const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { HttpError } = require("../helpers");

const { REFRESH_TOKEN_SECRET_KEY } = process.env;

const verifyRefreshToken = async (req, _, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.refreshToken || user.refreshToken !== token) {
      return next(HttpError(401));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = verifyRefreshToken;
