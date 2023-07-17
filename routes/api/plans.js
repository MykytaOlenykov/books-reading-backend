const { Router } = require("express");

const { authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/plans");

const router = Router();

// router.get("");

router.post("/", authenticate, ctrl.add);

// router.patch("");

module.exports = router;
