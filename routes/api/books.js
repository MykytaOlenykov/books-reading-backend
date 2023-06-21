const { Router } = require("express");

const router = Router();

router.get("/", (_, res) => {
  res.status(500).json({
    message: "This route has not yet been implemented",
  });
});

router.post("/", (_, res) => {
  res.status(500).json({
    message: "This route has not yet been implemented",
  });
});

router.delete("/:bookId", (_, res) => {
  res.status(500).json({
    message: "This route has not yet been implemented",
  });
});

router.patch("/review/:bookId", (_, res) => {
  res.status(500).json({
    message: "This route has not yet been implemented",
  });
});

module.exports = router;
