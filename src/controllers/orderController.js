const { Order, OrderItem } = require("../models/orderModels");
const { Cart, CartItem } = require("../models/cartModals");
const Product = require("../models/productModal");
exports.createOrder = async (req, res) => {
    try {
        const {
            customer_id,
            customer_name,
            customer_email,
            customer_phone,
            items,
            customer_address,
            shipping_cost,
            shipping_method,
            payment_method,
            note,
        } = req.body;
        // Tạo mã đơn hàng duy nhất
        const order_code = `ORD-${Date.now()}`;
        console.log("order_code", order_code);
        // Tính tổng tiền sản phẩm (giả sử giá mỗi sản phẩm là 10,000)

        // Tính tổng tiền cuối cùng
        const cart = await Cart.findOne({ where: { userId: customer_id } });
        const prodCheckout = await CartItem.findAll({ where: { cartId: cart.cartId } });
        const productIds = prodCheckout.map((item) => Number(item.productId));
        const products = await Product.findAll({ where: { id: productIds } });
        let total_price = prodCheckout.reduce((sum, item) => {
            const product = Array.from(products).find((it) => item.productId == it.id);
            return sum + item.quantity * product.price;
        }, 0);
        // Tạo đơn hàng
        const final_total = total_price + (shipping_cost || 0);
        const order = await Order.create({
            order_code,
            customer_id,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            status: "pending",
            total_price,
            shipping_cost: shipping_cost || 0,
            final_total,
            payment_method,
            payment_status: "pending",
            shipping_method: shipping_method || "standard",
            note,
        });

        // Thêm sản phẩm vào đơn hàng
        const orderItems = prodCheckout.map((item) => ({
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity,
        }));
        await OrderItem.bulkCreate(orderItems);

        CartItem.destroy({ where: { cartId: cart.cartId } });

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Hàm lấy đơn hàng theo trạng thái
exports.getOrdersByStatusFromDb = async (req, res) => {
    const { userId, status } = req.body;
    try {
        const orders = await Order.findAll({
            where: { status, customer_id: userId },
        });
        const orderIds = orders.map((item) => item.id);
        const result = {};
        for (let i = 0; i < orderIds.length; i++) {
            const orderId = orderIds[i];
            const orderItemsById = await OrderItem.findAll({ where: { order_id: orderId } });
            let products = [];
            for (item of orderItemsById) {
                const product = await Product.findOne({ where: { id: item.product_id } });
                products.push({
                    productId: product.id,
                    name: product.name,
                    image: String(product.images).split(',')[0], // Nếu có trường hình ảnh trong Product
                    price: product.price,
                    quantity: item.quantity,
                    color: "Đen"
                });
            }
            result[orderId] = products
        }

        return res.json({ data: orders, product: result });
    } catch (error) {
        throw new Error("Error fetching orders: " + error.message);
        res.status(500).json({ message: "Lỗi khi lấy order" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        // Kiểm tra xem đơn hàng có tồn tại không
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;
        await order.save();

        return res.json({ message: "Order status updated successfully", order });
    } catch (error) {
        return res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};