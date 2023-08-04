const { Router } = require("express");

const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/plan");
const ctrl = require("../../controllers/plans");
const { schemas: statisticSchemas } = require("../../models/statistic");

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
  "/statistics",
  authenticate,
  validateBody(statisticSchemas.addStatisticsSchema),
  ctrl.addStatistics
);

module.exports = router;
