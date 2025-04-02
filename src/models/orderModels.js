const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/db/index");
const Product = require("./productModal");

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_code: { type: DataTypes.STRING, unique: true, allowNull: false }, // Mã đơn hàng
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false },
    customer_email: { type: DataTypes.STRING, allowNull: false },
    customer_phone: { type: DataTypes.STRING, allowNull: false },
    customer_address: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    total_price: { type: DataTypes.FLOAT, allowNull: false },
    shipping_cost: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    final_total: { type: DataTypes.FLOAT, allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    payment_status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    shipping_method: { type: DataTypes.STRING, allowNull: false, defaultValue: 'standard' },
    tracking_number: { type: DataTypes.STRING, allowNull: true, defaultValue:UUIDV4 },
    shipping_status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'not_shipped' },
    estimated_delivery: { type: DataTypes.DATE, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    shippedAt: { type: DataTypes.DATE, allowNull: true },
    deliveredAt: { type: DataTypes.DATE, allowNull: true }
});

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Order, key: 'id' } },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
});

// Thiết lập quan hệ
// OrderItem model

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

sequelize.sync({ force: false }) // Không xóa dữ liệu cũ
    .then(() => console.log("✅ Đồng bộ Order Model thành công!"))
    .catch((err) => console.error("❌ Lỗi đồng bộ Order Model:", err));

module.exports = { Order, OrderItem };