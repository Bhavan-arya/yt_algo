import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatorDashboard = () => {
  const [creator, setCreator] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreatorData();
  }, []);

  const loadCreatorData = async () => {
    try {
      // For demo purposes, create a sample creator
      const sampleCreator = {
        _id: 'creator_1',
        channelName: 'Demo Creator',
        subscriberCount: 10000,
        totalViews: 50000,
        videos: []
      };

      const sampleVideos = [
        {
          _id: '1',
          title: 'Sample Video 1 - Technology Review',
          views: 1000,
          analytics: {
            totalKeystrokes: 45,
            skipForwardData: [
              { timestamp: 30, frequency: 5 },
              { timestamp: 120, frequency: 8 },
              { timestamp: 200, frequency: 3 }
            ],
            skipBackwardData: [
              { timestamp: 45, frequency: 2 },
              { timestamp: 180, frequency: 4 }
            ],
            pauseData: [
              { timestamp: 60, frequency: 3 },
              { timestamp: 150, frequency: 2 }
            ]
          },
          uploadDate: new Date('2024-01-15')
        },
        {
          _id: '2',
          title: 'Sample Video 2 - Tutorial',
          views: 500,
          analytics: {
            totalKeystrokes: 32,
            skipForwardData: [
              { timestamp: 90, frequency: 4 },
              { timestamp: 250, frequency: 6 }
            ],
            skipBackwardData: [
              { timestamp: 120, frequency: 3 },
              { timestamp: 300, frequency: 2 }
            ],
            pauseData: [
              { timestamp: 80, frequency: 2 },
              { timestamp: 200, frequency: 1 }
            ]
          },
          uploadDate: new Date('2024-01-10')
        }
      ];

      setCreator(sampleCreator);
      setVideos(sampleVideos);
      setLoading(false);
    } catch (error) {
      console.error('Error loading creator data:', error);
      setLoading(false);
    }
  };

  const calculateEngagementRate = (video) => {
    if (video.views === 0) return 0;
    return ((video.analytics?.totalKeystrokes || 0) / video.views * 100).toFixed(2);
  };

  const getTopPerformingVideos = () => {
    return videos
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const getMostEngagingVideos = () => {
    return videos
      .sort((a, b) => {
        const aEngagement = calculateEngagementRate(a);
        const bEngagement = calculateEngagementRate(b);
        return bEngagement - aEngagement;
      })
      .slice(0, 5);
  };

  const getTotalMetrics = () => {
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const totalKeystrokes = videos.reduce((sum, video) => sum + (video.analytics?.totalKeystrokes || 0), 0);
    const avgEngagement = videos.length > 0 ? (totalKeystrokes / totalViews * 100) : 0;

    return {
      totalViews,
      totalKeystrokes,
      avgEngagement: avgEngagement.toFixed(2),
      totalVideos: videos.length
    };
  };

  if (loading) {
    return <div>Loading creator dashboard...</div>;
  }

  const metrics = getTotalMetrics();

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        <div className="creator-info">
          <h2>{creator?.channelName}</h2>
          <p>{creator?.subscriberCount.toLocaleString()} subscribers</p>
        </div>
      </div>

      <div className="metrics-overview">
        <div className="metric-card">
          <h3>Total Views</h3>
          <div className="metric-value">{metrics.totalViews.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <h3>Total Videos</h3>
          <div className="metric-value">{metrics.totalVideos}</div>
        </div>
        <div className="metric-card">
          <h3>Total Keystrokes</h3>
          <div className="metric-value">{metrics.totalKeystrokes}</div>
        </div>
        <div className="metric-card">
          <h3>Avg. Engagement Rate</h3>
          <div className="metric-value">{metrics.avgEngagement}%</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>Top Performing Videos (by Views)</h3>
          <div className="videos-grid">
            {getTopPerformingVideos().map(video => (
              <div key={video._id} className="video-card">
                <h4>{video.title}</h4>
                <div className="video-stats">
                  <div className="stat">
                    <span className="stat-label">Views:</span>
                    <span className="stat-value">{video.views.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Keystrokes:</span>
                    <span className="stat-value">{video.analytics?.totalKeystrokes || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Engagement:</span>
                    <span className="stat-value">{calculateEngagementRate(video)}%</span>
                  </div>
                </div>
                <a href={`/analytics/${video._id}`} className="button">
                  View Analytics
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Most Engaging Videos (by Keystroke Rate)</h3>
          <div className="videos-grid">
            {getMostEngagingVideos().map(video => (
              <div key={video._id} className="video-card">
                <h4>{video.title}</h4>
                <div className="video-stats">
                  <div className="stat">
                    <span className="stat-label">Views:</span>
                    <span className="stat-value">{video.views.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Keystrokes:</span>
                    <span className="stat-value">{video.analytics?.totalKeystrokes || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Engagement:</span>
                    <span className="stat-value">{calculateEngagementRate(video)}%</span>
                  </div>
                </div>
                <a href={`/analytics/${video._id}`} className="button">
                  View Analytics
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Content Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Most Boring Sections</h4>
              <div className="insight-content">
                {videos.map(video => {
                  const boringSections = video.analytics?.skipForwardData
                    ?.sort((a, b) => b.frequency - a.frequency)
                    ?.slice(0, 1);
                  
                  if (!boringSections || boringSections.length === 0) return null;
                  
                  return (
                    <div key={video._id} className="insight-item">
                      <strong>{video.title}:</strong> {formatTime(boringSections[0].timestamp)} 
                      ({boringSections[0].frequency} skips)
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="insight-card">
              <h4>Most Exciting Sections</h4>
              <div className="insight-content">
                {videos.map(video => {
                  const excitingSections = video.analytics?.skipBackwardData
                    ?.sort((a, b) => b.frequency - a.frequency)
                    ?.slice(0, 1);
                  
                  if (!excitingSections || excitingSections.length === 0) return null;
                  
                  return (
                    <div key={video._id} className="insight-item">
                      <strong>{video.title}:</strong> {formatTime(excitingSections[0].timestamp)} 
                      ({excitingSections[0].frequency} rewinds)
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="insight-card">
              <h4>Most Interesting Sections</h4>
              <div className="insight-content">
                {videos.map(video => {
                  const interestingSections = video.analytics?.pauseData
                    ?.sort((a, b) => b.frequency - a.frequency)
                    ?.slice(0, 1);
                  
                  if (!interestingSections || interestingSections.length === 0) return null;
                  
                  return (
                    <div key={video._id} className="insight-item">
                      <strong>{video.title}:</strong> {formatTime(interestingSections[0].timestamp)} 
                      ({interestingSections[0].frequency} pauses)
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-header {
          background-color: #212121;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .creator-info h2 {
          color: #ff0000;
          margin: 0.5rem 0;
        }
        
        .creator-info p {
          color: #aaaaaa;
          margin: 0;
        }
        
        .metrics-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .metric-card {
          background-color: #212121;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #303030;
        }
        
        .metric-card h3 {
          color: #aaaaaa;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        
        .metric-value {
          color: #ffffff;
          font-size: 2rem;
          font-weight: bold;
        }
        
        .dashboard-section {
          margin-bottom: 3rem;
        }
        
        .dashboard-section h3 {
          color: #ffffff;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #ff0000;
          padding-bottom: 0.5rem;
        }
        
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .video-card {
          background-color: #212121;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #303030;
        }
        
        .video-card h4 {
          color: #ffffff;
          margin-bottom: 1rem;
        }
        
        .video-stats {
          margin-bottom: 1rem;
        }
        
        .stat {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0;
          padding: 0.25rem 0;
          border-bottom: 1px solid #333;
        }
        
        .stat:last-child {
          border-bottom: none;
        }
        
        .stat-label {
          color: #aaaaaa;
        }
        
        .stat-value {
          color: #ffffff;
          font-weight: bold;
        }
        
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .insight-card {
          background-color: #212121;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #303030;
        }
        
        .insight-card h4 {
          color: #ffffff;
          margin-bottom: 1rem;
        }
        
        .insight-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .insight-item {
          color: #aaaaaa;
          font-size: 0.9rem;
          padding: 0.5rem;
          background-color: #1a1a1a;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default CreatorDashboard;
