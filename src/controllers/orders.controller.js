const Product = require("../models/product");
const Order = require("../models/order");
const Customer = require("../models/customer");
const { groupByArray } = require("../utils/helpers");

const getOrders = async (req, res) => {
  const orders = await Order.find().populate('customer').populate('products');
  res.send(orders);
}

const importOrders = async (req, res) => {
    let orders =  req.body.data;
    const products = await Product.find();
    const customers = await Customer.find();
    orders =  orders.map((order) => {
      const product = products.find((product) => product.code === order.code);
      const customer = customers.find((customer) => customer.id === order.customerId);
      return({customer: customer._id, product: {product: product._id, quantity: parseInt(order.quantity)}})
    });

    orders = groupByArray(orders, 'customer');

    orders = orders.map((order) => {
      return new Order({customer: order.key, products: order.values.map((values) => values.product)})
    });

    Order.insertMany(orders).then((r) => console.log('Exito', r));
    res.send(orders);
}

module.exports = {
  getOrders,
  importOrders
}