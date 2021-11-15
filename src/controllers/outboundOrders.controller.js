const OutboundOrder = require("../models/outboundOrder");
const TransportOrder = require("../models/transportOrder");
const HandlingUnit = require("../models/handlingUnit");

const getOutboundOrders = async (req, res) => {
  const outboundOrders = await OutboundOrder.find().populate('order');
  outboundOrders.sort((a, b) => a.outboundOrderId - b.outboundOrderId);
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

const generateTransportOrders = async (req, res) => {
  const handlingUnits = req.body.data;
  const outboundOrder = await OutboundOrder.findById(req.params.orderId);
  outboundOrder.status = 'En proceso';
  await outboundOrder.save();
  handlingUnits.forEach( async handlingUnit => {
    const handlingUnitData = await HandlingUnit.findById(handlingUnit);
    const transportOrder = new TransportOrder({handlingUnit: handlingUnit, outboundOrder: req.params.orderId, location: handlingUnitData.location})
    await transportOrder.save();
    await HandlingUnit.findByIdAndUpdate(handlingUnit, {status: 'Por despachar', transportOrder: transportOrder._id});
  });
  res.send(handlingUnits);
}

module.exports = {
  getOutboundOrders,
  getOutboundOrderById,
  generateTransportOrders
}