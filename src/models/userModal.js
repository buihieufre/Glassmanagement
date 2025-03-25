const { DataTypes } = require("sequelize");
const sequelize = require("../config/db/index");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("user", "staff"),
        defaultValue: "user",
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
    },
});

// Đồng bộ model với database (tạo bảng nếu chưa có)
sequelize.sync({ force: false })
    .then(() => console.log("✅ Đồng bộ Model thành công!"))
    .catch((err) => console.error("❌ Lỗi đồng bộ Model:", err));

module.exports = User;
