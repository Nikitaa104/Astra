const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: [true, 'Device is required'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'RESOLVED'],
      default: 'ACTIVE',
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    triggeredAt: {
      type: Date,
      default: Date.now,
    },
    acknowledgedBy: [
      {
        contactId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        acknowledgedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
alertSchema.index({ user: 1 });
alertSchema.index({ device: 1 });
alertSchema.index({ status: 1 });
alertSchema.index({ triggeredAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
