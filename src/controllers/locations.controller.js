const Location = require("../models/location");

const getLocations = async (req, res) => {
    const locations = await Location.find();
    res.send(locations);
}

const getLocationsByRack = async (req, res) => {
  let locations = await Location.find().populate('handlingUnit');
  locations = locations.filter((location) => location.code.startsWith(req.params.rackCode))
  res.send(locations);
}

module.exports = {
    getLocations,
    getLocationsByRack
}