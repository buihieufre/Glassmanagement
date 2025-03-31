const router = require('express').Router()

const userRoutes = require('./userRoutes')
const productRoutes = require('./productRoutes')
const cartRoutes = require("./cartRoutes");
router.use("/", userRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);

module.exports = router