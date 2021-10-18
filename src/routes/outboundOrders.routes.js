const express = require('express');
const outboundOrdersController = require('../controllers/outboundOrders.controller');
const router = express.Router();

router.get('/', outboundOrdersController.getOutboundOrders);
router.get('/:orderId', outboundOrdersController.getOutboundOrderById);
router.post('/generateTransportOrders/:orderId', outboundOrdersController.generateTransportOrders);

module.exports = router;