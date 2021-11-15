const HandlingUnit = require("../models/handlingUnit");
const Location = require("../models/location");
const TransportOrder = require("../models/transportOrder");
const InboundOrder = require("../models/inboundOrder");
const OutboundOrder = require("../models/outboundOrder");
const graspAssignment = require('../algorithms/graspAssignment');

const getHandlingUnits = async (req, res) => {
    const handlingUnits = await HandlingUnit.find().populate('product').populate('location');
    handlingUnits.sort((a, b) => a.handlingUnitId - b.handlingUnitId);
    res.send(handlingUnits);
}

const getHandlingUnitsByProductId = async (req, res) => {
  let handlingUnits = await HandlingUnit.find().populate('product').populate('inboundOrder').populate('outboundOrder');
  handlingUnits = handlingUnits.filter((handlingUnit) => handlingUnit.product._id.toString() === req.params.productId);
  handlingUnits.sort((a, b) => a.handlingUnitId - b.handlingUnitId);
  res.send(handlingUnits);
}

const graspAssingation = async (req, res) => {
  let handlingUnitsLocations = await graspAssignment.graspAssignment(req.body.data);
  handlingUnitsLocations = handlingUnitsLocations.map((handlingUnitLocation) => {
    return ({
      handlingUnit: handlingUnitLocation.handlingUnit._id,
      location: handlingUnitLocation.location._id,
    })
  })
  handlingUnitsLocations.forEach( async (handlingUnitLocation) => {
    await HandlingUnit.findByIdAndUpdate(handlingUnitLocation.handlingUnit, {location: handlingUnitLocation.location, status: 'Libre disponibilidad'});
    const handlingUnit = await HandlingUnit.findById(handlingUnitLocation.handlingUnit);
    handlingUnit.location = handlingUnitLocation.location;
    handlingUnit.status = 'Libre disponibilidad';
    await handlingUnit.save();
    const inboundOrder = await InboundOrder.findById(handlingUnit.inboundOrder);
    const inboundOrderHandlingUnits = await InboundOrder.findById(handlingUnit.inboundOrder).populate('handlingUnits');
    if (inboundOrderHandlingUnits.handlingUnits.every((handlingUnit) => handlingUnit.status === 'Libre disponibilidad'))
      await inboundOrder.update({status: 'Finalizado'});
    else await inboundOrder.update({status: 'En proceso'});
    await Location.findByIdAndUpdate(handlingUnitLocation.location, {handlingUnit: handlingUnitLocation.handlingUnit, status: 'Ocupado'});
  });
  res.send(handlingUnitsLocations);
}

const graspAssingationTransport = async (req, res) => {
  let handlingUnitsLocations = await graspAssignment.graspAssignment(req.body.data);
  handlingUnitsLocations = handlingUnitsLocations.map((handlingUnitLocation) => {
    return ({
      handlingUnit: handlingUnitLocation.handlingUnit._id,
      location: handlingUnitLocation.location._id,
      inboundOrder: handlingUnitLocation.handlingUnit.inboundOrder
    })
  })
  handlingUnitsLocations.forEach( async (handlingUnitLocation) => {
    const transportOrder = new TransportOrder({handlingUnit: handlingUnitLocation.handlingUnit, location: handlingUnitLocation.location, inboundOrder: handlingUnitLocation.inboundOrder});
    transportOrder.save();
    await HandlingUnit.findByIdAndUpdate(handlingUnitLocation.handlingUnit, {location: handlingUnitLocation.location, status: 'Por ingresar'});
    await Location.findByIdAndUpdate(handlingUnitLocation.location, {handlingUnit: handlingUnitLocation.handlingUnit, status: 'Reservado'});
  });
  res.send(handlingUnitsLocations);
}

const storeHandlingUnit = async (req, res) => {
  const transportOrder = req.body.data;
  await TransportOrder.findByIdAndUpdate(transportOrder._id, {status: 'Finalizado'});
  await HandlingUnit.findByIdAndUpdate(transportOrder.handlingUnit._id, {status: 'Libre disponibilidad'});
  await Location.findByIdAndUpdate(transportOrder.handlingUnit.location._id, {status: 'Ocupado'});
  const inboundOrder = await InboundOrder.findById(transportOrder.handlingUnit.inboundOrder).populate('handlingUnits');
  if (inboundOrder.handlingUnits.every((handlingUnit) => handlingUnit.status === 'Libre disponibilidad' || handlingUnit.status === 'Observado'))
    await inboundOrder.update({status: 'Finalizado'});
  res.send(req.body.data);
}

const warnHandlingUnit = async (req, res) => {
  const transportOrder = req.body.data;
  await TransportOrder.findByIdAndUpdate(transportOrder._id, {status: 'Observado'});
  await HandlingUnit.findByIdAndUpdate(transportOrder.handlingUnit._id, {status: 'Observado'});
  // await Location.findByIdAndUpdate(transportOrder.handlingUnit.location._id, {status: 'Libre'});
  const inboundOrder = await InboundOrder.findById(transportOrder.handlingUnit.inboundOrder).populate('handlingUnits');
  if (inboundOrder.handlingUnits.every((handlingUnit) => handlingUnit.status === 'Libre disponibilidad' || handlingUnit.status === 'Observado' ))
    await inboundOrder.update({status: 'Finalizado'});
  res.send(req.body.data);
}

const dispatchHandlingUnit = async (req, res) => {
  const transportOrder = req.body.data;
  await TransportOrder.findByIdAndUpdate(transportOrder._id, {status: 'Finalizado'});
  await HandlingUnit.findByIdAndUpdate(transportOrder.handlingUnit._id, {status: 'Despachado'});
  await Location.findByIdAndUpdate(transportOrder.handlingUnit.location._id, {status: 'Libre'});
  const outboundOrder = await OutboundOrder.findById(transportOrder.handlingUnit.outboundOrder).populate('handlingUnits');
  if (outboundOrder.handlingUnits.every((handlingUnit) => handlingUnit.status === 'Despachado'))
    await outboundOrder.update({status: 'Finalizado'});
  else await outboundOrder.update({status: 'En proceso'});
  res.send(req.body.data);
}

const verifyHandlingUnit = async (req, res) => {
  await HandlingUnit.findByIdAndUpdate(req.params.handlingUnitId, {status: 'Registrado'});
  await InboundOrder.findByIdAndUpdate(req.params.inboundOrderId, {status: 'En inspección'});
  const inboundOrder = await InboundOrder.findById(req.params.inboundOrderId).populate('handlingUnits');
  if (inboundOrder.handlingUnits.every((handlingUnit) => handlingUnit.status === 'Registrado' || handlingUnit.status === 'Observado' ))
    await inboundOrder.update({status: 'En proceso'});
  else await inboundOrder.update({status: 'En inspección'});
  res.send(req.params.handlingUnitId);
}

const warnVerifyHandlingUnit = async (req, res) => {
  await HandlingUnit.findByIdAndUpdate(req.params.handlingUnitId, {status: 'Observado'});
  await InboundOrder.findByIdAndUpdate(req.params.inboundOrderId, {status: 'En inspección'});
  const inboundOrder = await InboundOrder.findById(req.params.inboundOrderId).populate('handlingUnits');
  if (inboundOrder.handlingUnits.every((handlingUnit) => handlingUnit.status === 'Registrado' || handlingUnit.status === 'Observado' ))
    await inboundOrder.update({status: 'En proceso'});
  else await inboundOrder.update({status: 'En inspección'});
  res.send(req.params.handlingUnitId);
}

module.exports = {
    getHandlingUnits,
    getHandlingUnitsByProductId,
    graspAssingation,
    graspAssingationTransport,
    storeHandlingUnit,
    warnHandlingUnit,
    dispatchHandlingUnit,
    verifyHandlingUnit,
    warnVerifyHandlingUnit
}