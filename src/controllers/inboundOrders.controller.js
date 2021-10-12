const InboundOrder = require("../models/inboundOrder");
const HandlingUnit = require("../models/handlingUnit");
const Product = require("../models/product");
const moment = require('moment');
const { groupByArray } = require("../utils/helpers");

const getInboundOrders = async (req, res) => {
  const inboundOrders = await InboundOrder.find();
  res.send(inboundOrders);
}

const importInboundOrders = async (req, res) => {
    let inboundOrders =  req.body.data;
    const products = await Product.find();
    inboundOrders =  inboundOrders.map((inboundOrder) => {
      const product = products.find((product) => product.code === inboundOrder.code);
      const expirationDate = moment(inboundOrder.expirationDate, "DD-MM-YYYY");
      const handlingUnit = new HandlingUnit({product: product._id, expirationDate: expirationDate.toDate()});
      return({orderId: inboundOrder.orderId, handlingUnit: handlingUnit})
    });

    inboundOrders = groupByArray(inboundOrders, 'orderId');
    inboundOrders = inboundOrders.map((inboundOrder) => inboundOrder.values.map((values) => values.handlingUnit));
    inboundOrders = inboundOrders.map((inboundOrder) => new InboundOrder({handlingUnits: inboundOrder}));
    InboundOrder.insertMany(inboundOrders)

    let handlingUnits = inboundOrders.map((inboundOrder) => inboundOrder.handlingUnits.map((handlingUnit) => ({...handlingUnit._doc, inboundOrder: inboundOrder._id})));
    handlingUnits = handlingUnits.flat(1);
    HandlingUnit.insertMany(handlingUnits);

    res.send(inboundOrders);
}

module.exports = {
  getInboundOrders,
  importInboundOrders
}