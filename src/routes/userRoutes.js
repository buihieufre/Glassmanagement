const router = require('express').Router()
const authController = require('../controllers/authController.js')
const authMiddleWare = require("../middlewares/authMiddleware.js");
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/login-admin", authController.loginAdmin);
router.post("/logout", authController.logout);
router.get("/get-all-user", authController.getUserList);
router.post("/update-role", authMiddleWare.adminAuthMiddleware, authController.updateRole);
router.post("/update-user-info", authController.updateUserInfo);

// router.post('forget-password', authController.forgetPassword)

module.exports = router