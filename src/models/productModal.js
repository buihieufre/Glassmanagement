const { DataTypes } = require("sequelize");
const sequelize = require("../config/db/index");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    short_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_thumbs: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    color_mapping: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    prod_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    material: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    style: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {timestamps: false});

// Đồng bộ model với database (tạo bảng nếu chưa có)
sequelize.sync({ force: false })
    .then(() => console.log("✅ Đồng bộ Product Model thành công!"))
    .catch((err) => console.error("❌ Lỗi đồng bộ Product Model:", err));

module.exports = Product;