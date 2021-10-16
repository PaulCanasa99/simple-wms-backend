const express = require('express');
const outboundOrdersController = require('../controllers/outboundOrders.controller');
const router = express.Router();

router.get('/', outboundOrdersController.getOutboundOrders);
router.get('/:orderId', outboundOrdersController.getOutboundOrderById);

module.exports = router;