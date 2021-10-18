const TransportOrder = require("../models/transportOrder");

const getTransportOrders = async (req, res) => {
  const transportOrders = await TransportOrder.find();
  res.send(transportOrders);
}

module.exports = {
  getTransportOrders
}