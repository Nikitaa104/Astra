const { Alert, Device } = require('../models');
const { sendNotifications } = require('../services/notificationService');

/**
 * @desc    Trigger SOS alert
 * @route   POST /api/sos
 * @access  Private
 */
const triggerSOS = async (req, res, next) => {
  try {
    const { deviceId, location } = req.body;

    // Validate deviceId
    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'deviceId is required',
      });
    }

    // Validate device ownership
    const device = await Device.findOne({
      _id: deviceId,
      user: req.user.userId,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found or not owned by user',
      });
    }

    // Prepare location (use provided or default)
    const alertLocation = {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    };

    // Create alert with status ACTIVE
    const alert = await Alert.create({
      user: req.user.userId,
      device: device._id,
      status: 'ACTIVE',
      location: alertLocation,
      triggeredAt: new Date(),
    });

    // Call notification service
    try {
      await sendNotifications(req.user.userId, alert._id);
    } catch (notifyError) {
      console.error('Notification error:', notifyError.message);
    }

    // Return alert response
    res.status(201).json({
      success: true,
      message: 'SOS alert triggered successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerSOS,
};

