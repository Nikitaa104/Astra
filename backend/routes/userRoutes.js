const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { authenticate } = require('../middleware');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/users/me
 * Returns logged-in user profile (existing endpoint - unchanged)
 */
router.get('/me', userController.getProfile);

/**
 * PATCH /api/users/me
 * Update logged-in user profile (existing endpoint - unchanged)
 */
router.patch('/me', userController.updateProfile);

/**
 * POST /api/users/me/contacts
 * Add emergency contact (existing endpoint - unchanged)
 */
router.post('/me/contacts', userController.addContact);

/**
 * PATCH /api/users/me/contacts/:contactId
 * Update emergency contact (NEW)
 */
router.patch('/me/contacts/:contactId', userController.updateContact);

/**
 * DELETE /api/users/me/contacts/:contactId
 * Remove emergency contact (existing endpoint - unchanged)
 */
router.delete('/me/contacts/:contactId', userController.removeContact);

module.exports = router;
