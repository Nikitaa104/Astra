const express = require('express');
const router = express.Router();
const { alertController } = require('../controllers');
const { authenticate } = require('../middleware');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/alerts/for-contact
 * Returns alerts where authenticated user is listed as emergency contact
 * Requires: emergency_contact role
 */
router.get('/for-contact', alertController.getAlertsForContact);

/**
 * GET /api/alerts/active
 * Returns currently ACTIVE alert for the authenticated main user
 * Returns null if no active alert
 */
router.get('/active', alertController.getActiveAlert);

/**
 * GET /api/alerts/me
 * Returns user's alert history (existing endpoint - unchanged)
 */
router.get('/me', alertController.getMyAlerts);

/**
 * GET /api/alerts/:id
 * Returns alert details by ID
 * Access: Alert owner OR emergency contact linked to the alert
 */
router.get('/:id', alertController.getAlertById);

/**
 * PATCH /api/alerts/:id/acknowledge
 * Acknowledge alert (emergency contacts only)
 * Does NOT resolve the alert
 */
router.patch('/:id/acknowledge', alertController.acknowledgeAlert);

/**
 * PATCH /api/alerts/:id/resolve
 * Mark alert as RESOLVED (existing endpoint - unchanged)
 */
router.patch('/:id/resolve', alertController.resolveAlert);

module.exports = router;
