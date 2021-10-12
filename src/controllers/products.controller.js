const Product = require("../models/product");

const getProducts = async (req, res) => {
    const products = await Product.find();
    res.send(products);
}

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  res.send(product);
}

module.exports = {
    getProducts,
    getProductById
}