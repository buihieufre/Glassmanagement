const router = require('express').Router()
const cartController = require('../controllers/cartController')

router.post("/add", cartController.addToCart)
router.get("/get/:userId", cartController.getCartItems);
module.exports = router