const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const KeystrokeData = require('../models/KeystrokeData');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new video
router.post('/', async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Record keystroke data
router.post('/:id/keystroke', async (req, res) => {
  try {
    const { keyType, timestamp, userId, sessionId } = req.body;
    
    // Validate keystroke data
    if (!['L', 'R', 'K'].includes(keyType)) {
      return res.status(400).json({ error: 'Invalid key type' });
    }

    // Get video duration
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Store keystroke data
    const keystrokeData = new KeystrokeData({
      videoId: req.params.id,
      userId,
      keyType,
      timestamp,
      videoDuration: video.duration,
      sessionId
    });

    await keystrokeData.save();

    // Update video analytics
    await updateVideoAnalytics(req.params.id);

    res.status(201).json({ message: 'Keystroke recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to update video analytics based on keystroke data
async function updateVideoAnalytics(videoId) {
  try {
    const keystrokes = await KeystrokeData.find({ videoId });
    
    // Process keystroke data for analytics
    const skipForwardData = processKeystrokeData(keystrokes, 'L');
    const skipBackwardData = processKeystrokeData(keystrokes, 'R');
    const pauseData = processKeystrokeData(keystrokes, 'K');

    // Update video with processed analytics
    await Video.findByIdAndUpdate(videoId, {
      'analytics.totalKeystrokes': keystrokes.length,
      'analytics.skipForwardData': skipForwardData,
      'analytics.skipBackwardData': skipBackwardData,
      'analytics.pauseData': pauseData
    });

  } catch (error) {
    console.error('Error updating video analytics:', error);
  }
}

// Function to process keystroke data into timestamp-based analytics
function processKeystrokeData(keystrokes, keyType) {
  const filteredKeystrokes = keystrokes.filter(ks => ks.keyType === keyType);
  
  // Create time bins (5-second intervals)
  const timeBins = {};
  
  filteredKeystrokes.forEach(keystroke => {
    let targetTimestamp;
    
    if (keyType === 'L') {
      // For L key, highlight 5 seconds before the timestamp
      targetTimestamp = Math.max(0, keystroke.timestamp - 5);
    } else if (keyType === 'R') {
      // For R key, highlight 5 seconds after the timestamp
      targetTimestamp = keystroke.timestamp + 5;
    } else {
      // For K key, highlight the exact timestamp
      targetTimestamp = keystroke.timestamp;
    }
    
    const bin = Math.floor(targetTimestamp / 5) * 5;
    timeBins[bin] = (timeBins[bin] || 0) + 1;
  });
  
  // Convert to array format
  return Object.entries(timeBins).map(([timestamp, frequency]) => ({
    timestamp: parseInt(timestamp),
    frequency
  })).sort((a, b) => a.timestamp - b.timestamp);
}

module.exports = router;
