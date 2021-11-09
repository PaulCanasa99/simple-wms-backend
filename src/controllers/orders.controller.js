const Product = require("../models/product");
const Order = require("../models/order");
const Customer = require("../models/customer");
const HandlingUnit = require("../models/handlingUnit");
const OutboundOrder = require("../models/outboundOrder");
const outboundSelectionAlgorithm = require('../algorithms/outboundSelection');
const { groupByArray } = require("../utils/helpers");

const getOrders = async (req, res) => {
  const orders = await Order.find().populate('customer').populate('products');
  orders.sort((a, b) => a.orderId - b.orderId);
  res.send(orders);
}

const getOrderById = async (req, res) => {
  let order = await Order.findById(req.params.orderId).populate('customer').populate({
    path: 'products',
    populate: {
      path: 'product',
      model: 'Product'
    }
  }).exec();
  const handlingUnits = await HandlingUnit.find().populate('product');
  const auxArray = order.products.map((product) => {
    const handlingUnitsStock = handlingUnits.filter((handlingUnit) => handlingUnit.status === 'Libre disponibilidad' && handlingUnit.product.code === product.product.code);
    return ({...product._doc, stock: handlingUnitsStock.length});
  })
  const auxObj = {...order._doc};
  auxObj.products = auxArray;
  res.send(auxObj);
}

const outboundSelection = async (req, res) => {
  const orderRows = req.body.data;
  let handlingUnits = await outboundSelectionAlgorithm.outboundSelectionAlgorithm(req.body.data, req.params.orderId);
  const order = await Order.findById(req.params.orderId);
  order.status = 'En proceso';
  orderRows.forEach(row => {
    order.products.id(row).status = 'Por despachar';
    order.save();
  });
  const outboundOrder = new OutboundOrder({handlingUnits: handlingUnits.map((handlingUnit)=>handlingUnit._id), order: req.params.orderId})
  await outboundOrder.save();
  handlingUnits.forEach( async handlingUnit => {
    await HandlingUnit.findByIdAndUpdate(handlingUnit._id, {status: 'Reservado', outboundOrder: outboundOrder._id});
  });
  res.send(handlingUnits);
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

    Order.create(orders).then((r) => console.log('Exito', r));
    res.send(orders);
}

module.exports = {
  getOrders,
  getOrderById,
  outboundSelection,
  importOrders
}