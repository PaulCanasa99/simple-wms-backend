const OutboundOrder = require("../models/outboundOrder");

const getOutboundOrders = async (req, res) => {
  const outboundOrders = await OutboundOrder.find();
  res.send(outboundOrders);
}

const getOutboundOrderById = async (req, res) => {
  let outboundOrder = await OutboundOrder.findById(req.params.orderId).populate({
    path: 'handlingUnits',
    populate: {
      path: 'product',
      model: 'Product'
    }
  }).exec();
  res.send(outboundOrder);
}

module.exports = {
  getOutboundOrders,
  getOutboundOrderById
}