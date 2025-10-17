const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  channelName: {
    type: String,
    required: true
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  totalViews: {
    type: Number,
    default: 0
  },
  subscriberCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Creator', creatorSchema);
