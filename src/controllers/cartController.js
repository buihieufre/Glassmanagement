const { Cart, CartItem } = require("../models/cartModals");
const Product = require("../models/productModal");

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const product = await Product.findByPk(productId);

        const cart = await Cart.findOne({ where: { userId } });

        if (cart) {
            const cartId = cart.cartId; // Ensure cartId is a string if required by the database
            const prod = await CartItem.findOne({where: {
                productId: productId,
                cartId: cartId
            }})
            if(prod) {
                prod.quantity+=quantity
                await prod.save()
            }else {
                await CartItem.create({
                    cartId: cart.cartId,
                    productId,
                    quantity,
                    price: product.price,
                });
            }
        } else {
            const newCart = await Cart.create({ userId });
            newCart.cartId = newCart.cartId; // Ensure cartId is a string if required by the database
            await CartItem.create({
                cartId: newCart.cartId,
                productId,
                quantity,
                price: product.price,
            });
        }
        const curCart = await Cart.findOne({where: {
            userId
        }})
        const productIds = await CartItem.findAll({
            where: { cartId: curCart.cartId },
            attributes: ['productId']
        }).then(items => items.map(item => item.productId));

        const productsInCart = await Product.findAll({
            where: {
            id: productIds
            }
        });
        res.status(200).json({ message: "Thêm vào giỏ hàng thành công", data: productsInCart });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error });
    }
};