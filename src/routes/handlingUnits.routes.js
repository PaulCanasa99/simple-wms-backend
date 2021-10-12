const express = require('express');
const handlingUnitController = require('../controllers/handlingUnits.controller');
const router = express.Router();

router.get('/', handlingUnitController.getHandlingUnits);
router.get('/:productId', handlingUnitController.getHandlingUnitsByProductId);
router.post('/graspAssignation', handlingUnitController.graspAssingation);

module.exports = router;