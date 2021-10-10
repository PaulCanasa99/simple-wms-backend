const Product = require("../models/product");

const getProducts = async (req, res) => {
    const products = await Product.find();
    res.send(products);
}

const getProductByCode = async (code) => {
  const product = await Product.findOne({code: code}).exec();
  return product;
}

module.exports = {
    getProducts,
    getProductByCode
}