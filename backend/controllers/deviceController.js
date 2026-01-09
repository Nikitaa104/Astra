const { Device } = require('../models');

/**
 * @desc    Register a new device
 * @route   POST /api/devices
 * @access  Private
 */
const registerDevice = async (req, res, next) => {
  try {
    const { deviceId, status, batteryLevel } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Device ID is required',
      });
    }

    // Check if device already exists
    const existingDevice = await Device.findOne({ deviceId });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        message: 'Device already registered',
      });
    }

    const device = await Device.create({
      deviceId,
      user: req.user.userId,
      status: status || 'ACTIVE',
      batteryLevel: batteryLevel || 100,
      lastSeen: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Device registered successfully',
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update device status or battery
 * @route   PATCH /api/devices/:id
 * @access  Private
 */
const updateDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, batteryLevel } = req.body;

    const device = await Device.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    if (status) device.status = status;
    if (batteryLevel !== undefined) device.batteryLevel = batteryLevel;
    device.lastSeen = new Date();

    await device.save();

    res.status(200).json({
      success: true,
      message: 'Device updated successfully',
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in user's devices
 * @route   GET /api/devices/me
 * @access  Private
 */
const getMyDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ user: req.user.userId }).sort({
      lastSeen: -1,
    });

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a device
 * @route   DELETE /api/devices/:id
 * @access  Private
 */
const deleteDevice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const device = await Device.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerDevice,
  updateDevice,
  getMyDevices,
  deleteDevice,
};
