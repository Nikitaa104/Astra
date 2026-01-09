const express = require('express');
const router = express.Router();
const { sosController } = require('../controllers');
const { authenticate } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// POST /api/sos
router.post('/', sosController.triggerSOS);

module.exports = router;

