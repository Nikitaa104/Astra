const { Alert, User } = require('../models');

/**
 * @desc    Get user's alert history
 * @route   GET /api/alerts/me
 * @access  Private
 * 
 * @example
 * Request: GET /api/alerts/me?status=ACTIVE&limit=10&page=1
 * Response: {
 *   "success": true,
 *   "count": 5,
 *   "total": 12,
 *   "page": 1,
 *   "pages": 2,
 *   "data": [...]
 * }
 */
const getMyAlerts = async (req, res, next) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    const query = { user: req.user.userId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const alerts = await Alert.find(query)
      .populate('device', 'deviceId status batteryLevel')
      .sort({ triggeredAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently ACTIVE alert for logged-in main user
 * @route   GET /api/alerts/active
 * @access  Private
 * 
 * @example
 * Request: GET /api/alerts/active
 * Response: {
 *   "success": true,
 *   "data": {
 *     "_id": "...",
 *     "status": "ACTIVE",
 *     "location": { "latitude": 40.7128, "longitude": -74.0060 },
 *     ...
 *   }
 * }
 * OR if no active alert: { "success": true, "data": null }
 */
const getActiveAlert = async (req, res, next) => {
  try {
    // Only main users can check their active alert
    // Authorization: Must be the alert owner (user field matches req.user.userId)
    const alert = await Alert.findOne({
      user: req.user.userId,
      status: 'ACTIVE',
    })
      .populate('device', 'deviceId status batteryLevel')
      .populate('user', 'name email phone')
      .sort({ triggeredAt: -1 });

    res.status(200).json({
      success: true,
      data: alert || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get alert details by ID
 * @route   GET /api/alerts/:id
 * @access  Private
 * Authorization: Alert owner OR emergency contact linked to the alert
 * 
 * @example
 * Request: GET /api/alerts/507f1f77bcf86cd799439011
 * Response: {
 *   "success": true,
 *   "data": {
 *     "_id": "...",
 *     "user": { "name": "Jane Doe", ... },
 *     "device": { "deviceId": "...", ... },
 *     "status": "ACTIVE",
 *     "location": { ... },
 *     ...
 *   }
 * }
 */
const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find alert with populated user and device
    const alert = await Alert.findById(id)
      .populate('user', 'name email phone emergencyContacts')
      .populate('device', 'deviceId status batteryLevel');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Authorization: Check if requester is alert owner
    const isOwner = alert.user._id.toString() === req.user.userId.toString();

    // Authorization: Check if requester is an emergency contact
    let isEmergencyContact = false;
    if (alert.user.emergencyContacts && alert.user.emergencyContacts.length > 0) {
      // Find contact by matching phone/email (assuming contact authenticated with same phone/email)
      const currentUser = await User.findById(req.user.userId);
      if (currentUser) {
        isEmergencyContact = alert.user.emergencyContacts.some(
          (contact) =>
            contact.phone === currentUser.phone || contact.phone === req.user.email
        );
      }
    }

    // Deny access if neither owner nor emergency contact
    if (!isOwner && !isEmergencyContact) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to view this alert.',
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get alerts for emergency contact
 * @route   GET /api/alerts/for-contact
 * @access  Private (emergency_contact role required)
 * 
 * @example
 * Request: GET /api/alerts/for-contact
 * Response: {
 *   "success": true,
 *   "count": 3,
 *   "data": [
 *     {
 *       "_id": "...",
 *       "user": { "name": "Jane Doe", "phone": "...", ... },
 *       "status": "ACTIVE",
 *       "triggeredAt": "2026-01-07T...",
 *       "location": { "latitude": 40.7128, "longitude": -74.0060 },
 *       ...
 *     }
 *   ]
 * }
 */
const getAlertsForContact = async (req, res, next) => {
  try {
    // Authorization: Must have emergency_contact role
    if (req.user.role !== 'emergency_contact') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Emergency contact role required.',
      });
    }

    // Get current user to match against emergency contacts
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find all users who have this contact in their emergency contacts list
    // Match by phone number or email
    const usersWithThisContact = await User.find({
      emergencyContacts: {
        $elemMatch: {
          $or: [
            { phone: currentUser.phone },
            { phone: currentUser.email },
          ],
        },
      },
    });

    if (usersWithThisContact.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'No alerts found for this contact',
      });
    }

    const userIds = usersWithThisContact.map((u) => u._id);

    // Find alerts for these users with ACTIVE or RECENT status
    // RECENT = triggered within last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const alerts = await Alert.find({
      user: { $in: userIds },
      $or: [
        { status: 'ACTIVE' },
        {
          status: 'RESOLVED',
          triggeredAt: { $gte: twentyFourHoursAgo },
        },
      ],
    })
      .populate('user', 'name email phone')
      .populate('device', 'deviceId status')
      .sort({ triggeredAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Acknowledge alert (emergency contacts only)
 * @route   PATCH /api/alerts/:id/acknowledge
 * @access  Private (emergency_contact role required)
 * Behavior: Store acknowledgedBy and acknowledgedAt, do NOT auto-resolve
 * 
 * @example
 * Request: PATCH /api/alerts/507f1f77bcf86cd799439011/acknowledge
 * Response: {
 *   "success": true,
 *   "message": "Alert acknowledged successfully",
 *   "data": {
 *     "_id": "...",
 *     "acknowledgedBy": [
 *       {
 *         "contactId": "...",
 *         "acknowledgedAt": "2026-01-07T..."
 *       }
 *     ],
 *     ...
 *   }
 * }
 */
const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Authorization: Only emergency contacts can acknowledge
    if (req.user.role !== 'emergency_contact') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only emergency contacts can acknowledge alerts.',
      });
    }

    // Find alert
    const alert = await Alert.findById(id)
      .populate('user', 'name email phone emergencyContacts');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Authorization: Verify this contact is in the alert's user's emergency contacts
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isEmergencyContact = alert.user.emergencyContacts.some(
      (contact) =>
        contact.phone === currentUser.phone || contact.phone === currentUser.email
    );

    if (!isEmergencyContact) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to acknowledge this alert.',
      });
    }

    // Check if already acknowledged by this contact
    const alreadyAcknowledged = alert.acknowledgedBy.some(
      (ack) => ack.contactId.toString() === req.user.userId.toString()
    );

    if (alreadyAcknowledged) {
      return res.status(400).json({
        success: false,
        message: 'Alert already acknowledged by you',
        data: alert,
      });
    }

    // Add acknowledgment (do NOT resolve)
    alert.acknowledgedBy.push({
      contactId: req.user.userId,
      acknowledgedAt: new Date(),
    });

    await alert.save();

    const updatedAlert = await Alert.findById(id)
      .populate('user', 'name email phone')
      .populate('device', 'deviceId status');

    res.status(200).json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: updatedAlert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark alert as RESOLVED
 * @route   PATCH /api/alerts/:id/resolve
 * @access  Private
 * 
 * @example
 * Request: PATCH /api/alerts/507f1f77bcf86cd799439011/resolve
 * Response: {
 *   "success": true,
 *   "message": "Alert resolved successfully",
 *   "data": { ... }
 * }
 */
const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Authorization: Only alert owner can resolve
    const alert = await Alert.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { status: 'RESOLVED' },
      { new: true }
    ).populate('device', 'deviceId status');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAlerts,
  getActiveAlert,
  getAlertById,
  getAlertsForContact,
  acknowledgeAlert,
  resolveAlert,
};
