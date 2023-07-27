const { Router } = require("express");

const { schemas } = require("../../models/book");
const { authenticate, isValidId, validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/books");

const router = Router();

router.get("/", authenticate, ctrl.getAll);

router.post("/", authenticate, validateBody(schemas.addBookSchema), ctrl.add);

router.delete("/:bookId", authenticate, isValidId, ctrl.deleteById);

router.patch(
  "/:bookId/review",
  authenticate,
  isValidId,
  validateBody(schemas.addBookReviewSchema),
  ctrl.addReview
);

module.exports = router;
