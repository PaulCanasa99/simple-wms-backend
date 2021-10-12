const express = require('express');
const outboundOrdersController = require('../controllers/outboundOrders.controller');
const router = express.Router();

router.get('/', outboundOrdersController.getOutboundOrders);

module.exports = router;