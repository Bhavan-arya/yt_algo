const express = require('express');
const router = express.Router();
const Creator = require('../models/Creator');
const Video = require('../models/Video');

// Get creator profile
router.get('/:id', async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id).populate('videos');
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new creator
router.post('/', async (req, res) => {
  try {
    const creator = new Creator(req.body);
    await creator.save();
    res.status(201).json(creator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get creator's videos with analytics
router.get('/:id/videos', async (req, res) => {
  try {
    const videos = await Video.find({ creatorId: req.params.id }).sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get creator dashboard data
router.get('/:id/dashboard', async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const videos = await Video.find({ creatorId: req.params.id });
    
    // Calculate dashboard metrics
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const totalKeystrokes = videos.reduce((sum, video) => sum + video.analytics.totalKeystrokes, 0);
    
    const dashboardData = {
      creator: {
        id: creator._id,
        channelName: creator.channelName,
        subscriberCount: creator.subscriberCount
      },
      metrics: {
        totalVideos: videos.length,
        totalViews,
        totalKeystrokes,
        averageViewsPerVideo: videos.length > 0 ? totalViews / videos.length : 0,
        averageKeystrokesPerVideo: videos.length > 0 ? totalKeystrokes / videos.length : 0
      },
      recentVideos: videos.slice(0, 5).map(video => ({
        id: video._id,
        title: video.title,
        views: video.views,
        keystrokeCount: video.analytics.totalKeystrokes,
        uploadDate: video.uploadDate
      }))
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
