const { Router } = require("express");

const { schemas } = require("../../models/book");
const { authenticate, isValidId, validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/books");

const router = Router();

router.get("/", authenticate, ctrl.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete("/:bookId", authenticate, isValidId, ctrl.deleteById);

// router.patch("/review/:bookId", (_, res) => {
//   res.status(500).json({
//     message: "This route has not yet been implemented",
//   });
// });

module.exports = router;
