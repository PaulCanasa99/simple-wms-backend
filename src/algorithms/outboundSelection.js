const moment = require('moment');
const HandlingUnit = require("../models/handlingUnit");
const Order = require("../models/order");

const FACTOR_DISTANCIA_VERTICAL = 10;

const outboundSelectionAlgorithm = async (positionsToDispatch, orderId) => {
  const solution = [];
  let order = await Order.findById(orderId).populate({
    path: 'products',
    populate: {
      path: 'product',
      model: 'Product'
    }
  })
  order = positionsToDispatch.map((position) => order.products.find((product) => product._id.toString() === position ));

  let handlingUnits = await HandlingUnit.find().populate('product').populate('location');
  handlingUnits = handlingUnits.filter(handlingUnit => handlingUnit.status === 'Libre disponibilidad');

  order.forEach(row => {
    for (let i = 0; i < row.quantity; i++) {
      const possibleHandlingUnits = handlingUnits.filter(handlingUnit => handlingUnit.product.code === row.product.code);
      const selectedUnit = aplicarCriterios(possibleHandlingUnits);
      handlingUnits = updateHandlingUnits(handlingUnits, selectedUnit);
      solution.push(selectedUnit);
    }
  })
  return solution;
}

const aplicarCriterios = (possibleHandlingUnits) => {
    return possibleHandlingUnits.reduce( (prev, curr) => {
        if (fechaExpiracion(prev).getTime() !== fechaExpiracion(curr).getTime()) {
            return fechaExpiracion(prev) < fechaExpiracion(curr) ? prev : curr;
        }
        if (fechaIngreso(prev).getTime() !== fechaIngreso(curr).getTime())
            return fechaIngreso(prev) < fechaIngreso(curr) ? prev : curr;
        return distancia(prev) < distancia(curr) ? prev : curr;
    });
}

const fechaExpiracion = (handlingUnit) => {
    return moment(handlingUnit.expirationDate, "DD-MM-YYYY").toDate();
}

const fechaIngreso = (handlingUnit) => {
    return moment(handlingUnit.entryDate, "DD-MM-YYYY").toDate();
}

const distancia = (handlingUnit) => {
    const { location } = handlingUnit.location;
    return location.xDistance + location.yDistance + location.zDistance * FACTOR_DISTANCIA_VERTICAL;
}

const updateHandlingUnits = (handlingUnits, selectedUnit) => {
  return handlingUnits.filter((handlingUnit) => handlingUnit._id !== selectedUnit._id);
}

module.exports = {
  outboundSelectionAlgorithm,
}