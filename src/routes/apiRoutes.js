const router = require('express').Router()
const authController = require('../controllers/authController.js')
router.post('/signup', authController.signup)
router.post('/login', authController.login)
// router.post('forget-password', authController.forgetPassword)

module.exports = router