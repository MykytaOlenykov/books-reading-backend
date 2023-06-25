const maxAge = Number(process.env.MAX_AGE);
const isProd = process.env.NODE_ENV !== "development";

const localCookieConfig = {
  httpOnly: true,
  maxAge,
};

const cookieConfig = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge,
};

module.exports = isProd ? cookieConfig : localCookieConfig;
