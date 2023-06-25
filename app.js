const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const usersRouter = require("./routes/api/users");
const booksRouter = require("./routes/api/books");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const { CLIENT_URL, COOKIE_SECRET_KEY } = process.env;

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(cookieParser(COOKIE_SECRET_KEY));

app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

module.exports = app;
