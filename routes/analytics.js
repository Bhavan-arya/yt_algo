const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const KeystrokeData = require('../models/KeystrokeData');

// Get analytics for a specific video
router.get('/video/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Get detailed keystroke data
    const keystrokes = await KeystrokeData.find({ videoId: req.params.id });
    
    const analytics = {
      videoId: video._id,
      title: video.title,
      totalViews: video.views,
      totalKeystrokes: keystrokes.length,
      analytics: video.analytics,
      detailedData: {
        skipForward: keystrokes.filter(k => k.keyType === 'L').length,
        skipBackward: keystrokes.filter(k => k.keyType === 'R').length,
        pauses: keystrokes.filter(k => k.keyType === 'K').length
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get timeline visualization data
router.get('/video/:id/timeline', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const keystrokes = await KeystrokeData.find({ videoId: req.params.id });
    
    // Generate timeline data with color-coded segments
    const timeline = generateTimelineData(keystrokes, video.duration);
    
    res.json({
      videoId: video._id,
      duration: video.duration,
      timeline: timeline
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get aggregated analytics across multiple videos
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const videos = await Video.find({ creatorId: req.params.creatorId });
    
    let totalKeystrokes = 0;
    let totalViews = 0;
    const aggregatedAnalytics = {
      skipForward: 0,
      skipBackward: 0,
      pauses: 0
    };

    for (const video of videos) {
      const keystrokes = await KeystrokeData.find({ videoId: video._id });
      
      totalKeystrokes += keystrokes.length;
      totalViews += video.views;
      
      keystrokes.forEach(ks => {
        if (ks.keyType === 'L') aggregatedAnalytics.skipForward++;
        else if (ks.keyType === 'R') aggregatedAnalytics.skipBackward++;
        else if (ks.keyType === 'K') aggregatedAnalytics.pauses++;
      });
    }

    res.json({
      creatorId: req.params.creatorId,
      totalVideos: videos.length,
      totalViews,
      totalKeystrokes,
      aggregatedAnalytics,
      videos: videos.map(v => ({
        id: v._id,
        title: v.title,
        views: v.views,
        keystrokeCount: v.analytics.totalKeystrokes
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to generate timeline visualization data
function generateTimelineData(keystrokes, duration) {
  const timeline = [];
  
  // Create time segments (1-second intervals)
  const segmentDuration = 1;
  const numSegments = Math.ceil(duration / segmentDuration);
  
  for (let i = 0; i < numSegments; i++) {
    const startTime = i * segmentDuration;
    const endTime = Math.min((i + 1) * segmentDuration, duration);
    
    const segment = {
      startTime,
      endTime,
      skipForward: 0,
      skipBackward: 0,
      pauses: 0,
      intensity: 0,
      color: null
    };
    
    // Count keystrokes in this time segment
    keystrokes.forEach(ks => {
      let relevantTimestamp;
      
      if (ks.keyType === 'L') {
        // For L key, highlight 5 seconds before
        relevantTimestamp = Math.max(0, ks.timestamp - 5);
      } else if (ks.keyType === 'R') {
        // For R key, highlight 5 seconds after
        relevantTimestamp = ks.timestamp + 5;
      } else {
        // For K key, highlight exact timestamp
        relevantTimestamp = ks.timestamp;
      }
      
      if (relevantTimestamp >= startTime && relevantTimestamp < endTime) {
        if (ks.keyType === 'L') segment.skipForward++;
        else if (ks.keyType === 'R') segment.skipBackward++;
        else if (ks.keyType === 'K') segment.pauses++;
      }
    });
    
    // Calculate intensity and determine color
    const totalActivity = segment.skipForward + segment.skipBackward + segment.pauses;
    segment.intensity = totalActivity;
    
    if (segment.skipForward > segment.skipBackward && segment.skipForward > segment.pauses) {
      segment.color = 'red'; // Boring/skippable content
    } else if (segment.skipBackward > segment.skipForward && segment.skipBackward > segment.pauses) {
      segment.color = 'cyan'; // Exciting/rewatchable content
    } else if (segment.pauses > 0) {
      segment.color = 'green'; // Interesting/pausable content
    }
    
    timeline.push(segment);
  }
  
  return timeline;
}

module.exports = router;
