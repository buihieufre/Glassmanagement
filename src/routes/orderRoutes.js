const router = require('express').Router()
const orderController = require("../controllers/orderController")
router.post('/create', orderController.createOrder)
router.post('/get', orderController.getOrdersByStatusFromDb)
router.post('/update', orderController.updateOrderStatus)
module.exports = router