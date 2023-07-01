const maxAge = Number(process.env.MAX_AGE);
const isProd = process.env.NODE_ENV !== "development";

const localCookieConfig = {
  httpOnly: true,
  maxAge,
  signed: true,
};

const cookieConfig = {
  httpOnly: true,
  maxAge,
  signed: true,
  sameSite: "none",
  secure: true,
};

module.exports = isProd ? cookieConfig : localCookieConfig;
