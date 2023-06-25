const { Router } = require("express");

const { schemas } = require("../../models/book");
const { authenticate, validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/books");

const router = Router();

router.get("/", authenticate, ctrl.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

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
