const Product = require('../models/productModal')
exports.getAllProduct = async (req, res) => {
    const products = await Product.findAll()
    res.json(products)
}

exports.getPaginatedProduct = async (req, res) => {
    const { page, limit, filter } = req.body;

    const filterPresent = ["category", "material", "style", "gender"]
    const filterOption =  {}
    for(let key in filterPresent){
        if(filter.hasOwnProperty(filterPresent[key])){
            filterOption[filterPresent[key]] = filter[filterPresent[key]]
        }
    }
    const productsAll = await Product.findAll({where: filterOption})
    const totalProducts = productsAll.length
    const totalPages = Math.ceil(totalProducts / limit)

    const data = productsAll.slice(limit * (page - 1), limit * (page - 1) + 12) 
    const result = {
        page,
        limit,
        totalProducts,
        totalPages,
        data
    }
    res.json(result)
}