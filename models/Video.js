const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  creatorId: {
    type: String,
    required: true,
    index: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  analytics: {
    totalKeystrokes: {
      type: Number,
      default: 0
    },
    skipForwardData: [{
      timestamp: Number,
      frequency: Number
    }],
    skipBackwardData: [{
      timestamp: Number,
      frequency: Number
    }],
    pauseData: [{
      timestamp: Number,
      frequency: Number
    }]
  }
});

module.exports = mongoose.model('Video', videoSchema);
