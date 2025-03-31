const { Op } = require("sequelize");
const Product = require("../models/productModal");
const { Cart, CartItem } = require("../models/cartModals"); // Assuming you have a Cart model
exports.getAllProduct = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};
Product.sequelize.fn();
exports.getFilterOption = async (req, res) => {
    try {
        const [categories, materials, styles, genders] = await Promise.all([
            Product.findAll({
                attributes: [
                    [
                        Product.sequelize.fn("DISTINCT", Product.sequelize.col("category")),
                        "category",
                    ],
                ],
            }),
            Product.findAll({
                attributes: [
                    [
                        Product.sequelize.fn("DISTINCT", Product.sequelize.col("material")),
                        "material",
                    ],
                ],
            }),
            Product.findAll({
                attributes: [
                    [Product.sequelize.fn("DISTINCT", Product.sequelize.col("style")), "style"],
                ],
            }),
            Product.findAll({
                attributes: [
                    [Product.sequelize.fn("DISTINCT", Product.sequelize.col("gender")), "gender"],
                ],
            }),
        ]);
        res.json({
            categories: categories.map((item) => item.category),
            materials: materials.map((item) => item.material),
            styles: styles.map((item) => item.style),
            genders: genders.map((item) => item.gender),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching filter options", error });
    }
};

exports.getPaginatedProduct = async (req, res) => {
    const { page, limit, filter } = req.body;

    const filterPresent = ["category", "material", "style", "gender"];
    const filterOption = {};
    for (let key in filterPresent) {
        if (filter.hasOwnProperty(filterPresent[key])) {
            filterOption[filterPresent[key]] = filter[filterPresent[key]];
        }
    }
    const productsAll = await Product.findAll({ where: filterOption });
    const totalProducts = productsAll.length;
    const totalPages = Math.ceil(totalProducts / limit);

    const data = productsAll.slice(limit * (page - 1), limit * (page - 1) + 12);
    const result = {
        page,
        limit,
        totalProducts,
        totalPages,
        data,
    };
    res.json(result);
};

exports.getPaginatedProductAdmin = async (req, res) => {
    const { page, limit, searchString } = req.body;
    const data = await Product.findAll({
        where: {
            name: {
                [Op.like]: `%${searchString}%`,
            },
        },
        offset: page,
        limit: limit,
    });

    const productsAll = await Product.findAll({
        where: {
            name: {
                [Op.like]: `%${searchString}%`,
            },
        },
    });
    const totalProducts = productsAll.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const result = {
        page,
        limit,
        totalProducts,
        totalPages,
        data,
    };
    res.json(result);
};

// exports.addProduct = async (req, res) => {

// }
