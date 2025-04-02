const router = require('express').Router()

const userRoutes = require('./userRoutes')
const productRoutes = require('./productRoutes')
const cartRoutes = require("./cartRoutes");
const paymentRoutes = require("./paymentRoutes");
const orderRoutes = require("./orderRoutes");
router.use("/", userRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes);
router.use("/order", orderRoutes);

module.exports = router