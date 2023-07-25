const { Router } = require("express");

const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/plan");
const ctrl = require("../../controllers/plans");
const { schemas: statsSchema } = require("../../models/stat");

const router = Router();

router.get("/", authenticate, ctrl.get);

router.post("/", authenticate, validateBody(schemas.addPlanSchema), ctrl.add);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.changePlanStatusSchema),
  ctrl.changeStatus
);

router.delete("/", authenticate, ctrl.finish);

router.patch(
  "/stats",
  authenticate,
  validateBody(statsSchema.addStatsSchema),
  ctrl.addStats
);

module.exports = router;
