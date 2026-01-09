const express = require('express');
const router = express.Router();
const { deviceController } = require('../controllers');
const { authenticate } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// POST /api/devices
router.post('/', deviceController.registerDevice);

// GET /api/devices/me
router.get('/me', deviceController.getMyDevices);

// PATCH /api/devices/:id
router.patch('/:id', deviceController.updateDevice);

// DELETE /api/devices/:id
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;
