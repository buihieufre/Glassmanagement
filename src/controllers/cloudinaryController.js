const cloudinary = require("../config/cloudinary");

exports.uploadProduct = async (req, res) => {
    try {
        if (req.files && Array.from(req.files["images"]).length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        const {
            name,
            price,
            gender,
            prod_content,
            short_desc,
            category,
            material,
            style,
            images,
            image_thumbs,
        } = req.body;
        console.log(
            name,
            price,
            gender,
            prod_content,
            short_desc,
            category,
            material,
            style,
            images,
            image_thumbs
        );
        const uploadImageThumb = await cloudinary.uploader.upload(image_thumbs[0].path, {
            folder: "uploads",
        });
        const uploadPromises = Array.from(images).map((file) =>
            cloudinary.uploader.upload(file.path, {
                folder: "uploads",
            })
        );

        const results = await Promise.all(uploadPromises);
        res.status(200).json({
            message: "Images uploaded successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};
