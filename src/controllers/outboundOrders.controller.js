const OutboundOrder = require("../models/outboundOrder");

const getOutboundOrders = async (req, res) => {
  const outboundOrders = await OutboundOrder.find();
  res.send(outboundOrders);
}

module.exports = {
  getOutboundOrders
}