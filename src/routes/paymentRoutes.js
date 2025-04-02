const router = require('express').Router()
const paymentController = require("../controllers/paymentController")
router.post("/cash",paymentController.payment )
router.post("/callback",paymentController.afterPayment )
module.exports = router
