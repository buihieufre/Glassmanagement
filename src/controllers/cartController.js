const { Cart, CartItem } = require("../models/cartModals");
const Product = require("../models/productModal");

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const product = await Product.findByPk(productId);
        if (quantity > product.quantity) {
            return res.status(400).json({ message: "Không đủ số lượng" });
        }
        const cart = await Cart.findOne({ where: { userId } });

        if (cart) {
            const cartId = cart.cartId; // Ensure cartId is a string if required by the database
            const prod = await CartItem.findOne({
                where: {
                    productId: productId,
                    cartId: cartId,
                },
            });
            if (prod) {
                const newQtt = prod.quantity + quantity;

                if (newQtt > product.quantity) {
                    return res.status(400).json({ message: "Không đủ số lượng" });
                }
                await CartItem.update(
                    { quantity: newQtt },
                    {
                        where: {
                            productId: productId,
                            cartId: cartId,
                        },
                    }
                );
            } else {
                await CartItem.create({
                    cartId: cart.cartId,
                    productId,
                    quantity,
                    price: product.price,
                });
            }
        } else {
            const newCart = await Cart.create({ userId });
            newCart.cartId = newCart.cartId;
            await CartItem.create({
                cartId: newCart.cartId,
                productId,
                quantity,
                price: product.price,
            });
        }
        const curCart = await Cart.findOne({
            where: {
                userId,
            },
        });
        const productIds = await CartItem.findAll({
            where: { cartId: curCart.cartId },
            attributes: ["productId"],
        }).then((items) => items.map((item) => item.productId));

        const productsInCart = await Product.findAll({
            where: {
                id: productIds,
            },
        });
        res.status(200).json({ message: "Thêm vào giỏ hàng thành công", data: productsInCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        const cartItems = await CartItem.findAll({
            where: { cartId: cart.cartId },
            attributes: ["productId", "quantity"],
        }).then((items) => items.map((item) => ({ id: item.productId, quantity: item.quantity })));

        const result = await Promise.all(
            cartItems.map(async (item) => {
                const prod = await Product.findOne({ where: { id: item.id } });
                const prodImage = prod.images.split(",")[0];
                return {
                    ...item,
                    image: prodImage,
                    color_mapping: prod.color_mapping,
                    price: prod.price,
                    name: prod.name,
                    quantityInStock: prod.quantity,
                };
            })
        );
        return res.status(200).json({ message: "Lấy giỏ hàng thành công", data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        const cartItem = await CartItem.findOne({
            where: {
                cartId: cart.cartId,
                productId: productId,
            },
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

        await cartItem.destroy();

        return res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng", error });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({
            where: {
                userId,
            },
        });
        const cartItem = await CartItem.findOne({
            where: {
                cartId: cart.cartId,
                productId: productId,
            },
        });
        if (quantity >= 1) {
            const productInstance = await Product.findOne({ where: { id: productId } });

            if (quantity > productInstance.quantity) {
                return res
                    .status(200)
                    .json({ message: "Không thể thêm nữa vì đã vượt quá số lượng hàng trong kho" });
            } else {
                await CartItem.update(
                    { quantity: quantity },
                    { where: { cartId: cart.cartId, productId } }
                );
                return res.status(200);
            }
        } else {
            await cartItem.destroy();
            return res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
        }
    } catch (error) {
        console.error("Lỗi khi update quantity");
        return res.status(500).json({ message: "Server error" });
    }
}

// exports.getTotalAmount = async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// }