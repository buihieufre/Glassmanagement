const router = require('express').Router()
const cartController = require('../controllers/cartController')

router.post("/add", cartController.addToCart)
module.exports = router