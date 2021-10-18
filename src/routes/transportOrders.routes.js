const express = require('express');
const transportOrderController = require('../controllers/trasnportOrder.controller');
const router = express.Router();

router.get('/', transportOrderController.getTransportOrders);

module.exports = router;