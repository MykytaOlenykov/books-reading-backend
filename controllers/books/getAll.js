const { Book } = require("../../models/book");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Book.find({ owner });

  const goingToRead = result.filter(({ pagesFinished }) => pagesFinished === 0);

  const currentlyReading = result.filter(
    ({ pagesTotal, pagesFinished }) =>
      pagesFinished !== 0 && pagesTotal !== pagesFinished
  );

  const finishedReading = result.filter(
    ({ pagesTotal, pagesFinished }) => pagesFinished === pagesTotal
  );

  res.json({
    goingToRead,
    currentlyReading,
    finishedReading,
  });
};

module.exports = getAll;
