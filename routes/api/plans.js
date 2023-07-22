const { Router } = require("express");

const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/plan");
const ctrl = require("../../controllers/plans");

const router = Router();

router.get("/", authenticate, ctrl.get);

router.post("/", authenticate, validateBody(schemas.addPlanSchema), ctrl.add);

// router.patch("");

module.exports = router;
