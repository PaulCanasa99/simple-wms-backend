const express = require('express');
const inboundOrdersController = require('../controllers/inboundOrders.controller');
const router = express.Router();

router.get('/', inboundOrdersController.getInboundOrders);
router.get('/:orderId', inboundOrdersController.getInboundOrderById);
router.post('/import', inboundOrdersController.importInboundOrders);

module.exports = router;