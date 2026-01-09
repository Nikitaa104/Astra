const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
deviceSchema.index({ user: 1 });

module.exports = mongoose.model('Device', deviceSchema);
