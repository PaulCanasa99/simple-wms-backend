const HandlingUnit = require("../models/handlingUnit");

const getHandlingUnits = async (req, res) => {
    const handlingUnits = await HandlingUnit.find().populate('product');
    res.send(handlingUnits);
}

module.exports = {
    getHandlingUnits,
}