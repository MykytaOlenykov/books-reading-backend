const jwt = require("jsonwebtoken");

const HttpError = require("./HttpError");

const { REFRESH_TOKEN_SECRET_KEY } = process.env;

const verifyRefreshToken = (token) => {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
    return payload.id;
  } catch (error) {
    throw HttpError(401);
  }
};

module.exports = verifyRefreshToken;
