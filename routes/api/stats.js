const { Router } = require("express");

const { authenticate, validateBody } = require("../../middlewares");
const ctrl = require("../../controllers/stats");
const { schemas } = require("../../models/stat");

const router = Router();

router.post("/", authenticate, validateBody(schemas.addStatsSchema), ctrl.add);

module.exports = router;
