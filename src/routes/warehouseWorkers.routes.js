const express = require('express');
const warehouseWorkerController = require('../controllers/warehouseWorker.controller');
const router = express.Router();

router.post('/authenticate', warehouseWorkerController.authenticate);

module.exports = router;