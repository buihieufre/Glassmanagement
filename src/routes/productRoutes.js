const router = require('express').Router()
const productController = require('../controllers/productController')
const cloudinaryController = require("../controllers/cloudinaryController");
const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.get("/get", productController.getAllProduct);
router.get("/get-filter-option", productController.getFilterOption);
router.post("/get-paginated", productController.getPaginatedProduct);
router.post("/get-paginated-admin", productController.getPaginatedProductAdmin);
router.use(
    "/create",
    upload.fields([{ name: "images" }, { name: "image_thumbs" }]),
    cloudinaryController.uploadProduct
);
module.exports = router