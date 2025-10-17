const mongoose = require('mongoose');

const keystrokeDataSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  keyType: {
    type: String,
    enum: ['L', 'R', 'K'],
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  videoDuration: {
    type: Number,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
keystrokeDataSchema.index({ videoId: 1, keyType: 1, timestamp: 1 });

module.exports = mongoose.model('KeystrokeData', keystrokeDataSchema);
