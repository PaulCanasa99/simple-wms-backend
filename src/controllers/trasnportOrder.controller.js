const TransportOrder = require("../models/transportOrder");

const getTransportOrders = async (req, res) => {
  const transportOrders = await TransportOrder.find().populate('location').populate({
    path: 'handlingUnit',
    populate: {
      path: 'product',
      model: 'Product'
    }
  });
  res.send(transportOrders);
}

module.exports = {
  getTransportOrders
}