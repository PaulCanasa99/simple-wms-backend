const express = require('express');
const locationsController = require('../controllers/locations.controller');
const router = express.Router();

router.get('/', locationsController.getLocations);

router.get('/:rackCode', locationsController.getLocationsByRack);

module.exports = router;