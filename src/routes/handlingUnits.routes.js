const express = require('express');
const handlingUnitController = require('../controllers/handlingUnits.controller');
const router = express.Router();

router.get('/', handlingUnitController.getHandlingUnits);

module.exports = router;