const { Router } = require("express");
const router = Router();
const userCtrl = require("../controller/users.controller");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.put("/usuarios", userCtrl.edit);

module.exports = router;