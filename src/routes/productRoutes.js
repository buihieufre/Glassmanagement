const router = require('express').Router()
const productController = require('../controllers/productController')

router.get('/get',productController.getAllProduct)
router.get('/get-filter-option',productController.getFilterOption)
router.post('/get-paginated',productController.getPaginatedProduct)
module.exports = router