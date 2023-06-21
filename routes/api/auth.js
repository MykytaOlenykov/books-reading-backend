const { Router } = require("express");

const ctrl = require("../../controllers/auth");

const router = Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.post("/logout", ctrl.logout);

router.post("/refresh", ctrl.refresh);

router.get("/google", (_, res) => {
  res.status(500).json({
    message: "This route has not yet been implemented",
  });
});

module.exports = router;
