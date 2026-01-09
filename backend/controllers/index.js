const authController = require('./authController');
const userController = require('./userController');
const deviceController = require('./deviceController');
const alertController = require('./alertController');
const sosController = require('./sosController');

module.exports = {
  authController,
  userController,
  deviceController,
  alertController,
  sosController,
};

/**
 * ===========================================
 * API SUMMARY (All Endpoints)
 * ===========================================
 * 
 * AUTH (Public)
 * - POST /api/auth/register
 * - POST /api/auth/login
 * 
 * USERS (Private)
 * - GET    /api/users/me
 * - PATCH  /api/users/me
 * - POST   /api/users/me/contacts
 * - PATCH  /api/users/me/contacts/:contactId  [NEW]
 * - DELETE /api/users/me/contacts/:contactId
 * 
 * DEVICES (Private)
 * - POST   /api/devices
 * - GET    /api/devices/me
 * - PATCH  /api/devices/:id
 * - DELETE /api/devices/:id
 * 
 * SOS (Private)
 * - POST /api/sos
 * 
 * ALERTS (Private)
 * - GET   /api/alerts/me
 * - GET   /api/alerts/active          [NEW]
 * - GET   /api/alerts/for-contact     [NEW - emergency_contact role]
 * - GET   /api/alerts/:id             [NEW]
 * - PATCH /api/alerts/:id/acknowledge [NEW - emergency_contact role]
 * - PATCH /api/alerts/:id/resolve
 * 
 * ===========================================
 */
