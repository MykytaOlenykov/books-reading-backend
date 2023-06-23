const { Router } = require("express");

const { schemas } = require("../../models/user");
const { validateBody, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/users");

const router = Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/refresh", ctrl.refresh);

router.get("/google", (_, res) => {
  res.status(500).json({
    message: "This route has not yet been implemented",
  });
});

module.exports = router;
