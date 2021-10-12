const HandlingUnit = require("../models/handlingUnit");
const Location = require("../models/location");
const graspAssignment = require('../algorithms/graspAssignment');

const getHandlingUnits = async (req, res) => {
    const handlingUnits = await HandlingUnit.find().populate('product').populate('location');
    res.send(handlingUnits);
}

const getHandlingUnitsByProductId = async (req, res) => {
  let handlingUnits = await HandlingUnit.find().populate('product').populate('inboundOrder');
  handlingUnits = handlingUnits.filter((handlingUnit) => handlingUnit.product._id.toString() === req.params.productId);
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
    await HandlingUnit.findByIdAndUpdate(handlingUnitLocation.handlingUnit, {location: handlingUnitLocation.location, status: 'Disponible'});
    await Location.findByIdAndUpdate(handlingUnitLocation.location, {handlingUnit: handlingUnitLocation.handlingUnit, status: 'Ocupado'});
  });
  res.send(handlingUnitsLocations);
}

module.exports = {
    getHandlingUnits,
    getHandlingUnitsByProductId,
    graspAssingation
}