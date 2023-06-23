const bcrypt = require("bcrypt");

const { User } = require("../../models/user");
const { HttpError, createTokens } = require("../../helpers");

const { COOKIE_MAX_AGE } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(403, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(403, "Email or password is wrong");
  }

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.cookie("refreshToken", refreshToken, {
    maxAge: Number(COOKIE_MAX_AGE),
    httpOnly: true,
    signed: true,
    secure: true,
  });

  res.json({
    userData: {
      name: user.name,
      email: user.email,
    },
    accessToken,
  });
};

module.exports = login;
