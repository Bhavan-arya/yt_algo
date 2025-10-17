import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  const { videoId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      loadVideoAnalytics(videoId);
    } else {
      loadAllVideos();
    }
  }, [videoId]);

  const loadVideoAnalytics = async (id) => {
    try {
      const response = await axios.get(`/api/analytics/video/${id}`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Load sample data for demo
      setAnalytics({
        videoId: id,
        title: 'Sample Video Analytics',
        totalViews: 1000,
        totalKeystrokes: 45,
        analytics: {
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
        detailedData: {
          skipForward: 16,
          skipBackward: 6,
          pauses: 5
        }
      });
      setLoading(false);
    }
  };

  const loadAllVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([
        {
          _id: '1',
          title: 'Sample Video 1',
          views: 1000,
          analytics: { totalKeystrokes: 45 }
        },
        {
          _id: '2',
          title: 'Sample Video 2',
          views: 500,
          analytics: { totalKeystrokes: 32 }
        }
      ]);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateChartData = () => {
    if (!analytics) return null;

    const skipForwardTimes = analytics.analytics.skipForwardData.map(d => formatTime(d.timestamp));
    const skipForwardFreqs = analytics.analytics.skipForwardData.map(d => d.frequency);
    
    const skipBackwardTimes = analytics.analytics.skipBackwardData.map(d => formatTime(d.timestamp));
    const skipBackwardFreqs = analytics.analytics.skipBackwardData.map(d => d.frequency);
    
    const pauseTimes = analytics.analytics.pauseData.map(d => formatTime(d.timestamp));
    const pauseFreqs = analytics.analytics.pauseData.map(d => d.frequency);

    return {
      labels: [...new Set([...skipForwardTimes, ...skipBackwardTimes, ...pauseTimes])].sort(),
      datasets: [
        {
          label: 'Skip Forward (Boring)',
          data: skipForwardFreqs,
          backgroundColor: 'rgba(255, 68, 68, 0.8)',
          borderColor: 'rgba(255, 68, 68, 1)',
          borderWidth: 1,
        },
        {
          label: 'Skip Backward (Exciting)',
          data: skipBackwardFreqs,
          backgroundColor: 'rgba(68, 255, 255, 0.8)',
          borderColor: 'rgba(68, 255, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Pauses (Interesting)',
          data: pauseFreqs,
          backgroundColor: 'rgba(68, 255, 68, 0.8)',
          borderColor: 'rgba(68, 255, 68, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard</h1>
      
      {analytics ? (
        <div>
          <div className="analytics-header">
            <h2>{analytics.title}</h2>
            <div className="analytics-metrics">
              <div className="metric">
                <span className="metric-label">Total Views:</span>
                <span className="metric-value">{analytics.totalViews}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Total Keystrokes:</span>
                <span className="metric-value">{analytics.totalKeystrokes}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Engagement Rate:</span>
                <span className="metric-value">
                  {((analytics.totalKeystrokes / analytics.totalViews) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Keystroke Breakdown</h3>
              <div className="keystroke-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Skip Forward (L):</span>
                  <span className="breakdown-value red">
                    {analytics.detailedData.skipForward}
                  </span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Skip Backward (J):</span>
                  <span className="breakdown-value cyan">
                    {analytics.detailedData.skipBackward}
                  </span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Pauses (K):</span>
                  <span className="breakdown-value green">
                    {analytics.detailedData.pauses}
                  </span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Timeline Analysis</h3>
              {generateChartData() && (
                <Bar
                  data={generateChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Keystroke Activity Over Time',
                      },
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#ffffff',
                        },
                        grid: {
                          color: '#333333',
                        },
                      },
                      x: {
                        ticks: {
                          color: '#ffffff',
                        },
                        grid: {
                          color: '#333333',
                        },
                      },
                    },
                  }}
                />
              )}
            </div>

            <div className="analytics-card">
              <h3>Key Insights</h3>
              <div className="insights">
                <div className="insight">
                  <h4>Most Boring Sections:</h4>
                  <ul>
                    {analytics.analytics.skipForwardData
                      .sort((a, b) => b.frequency - a.frequency)
                      .slice(0, 3)
                      .map((data, index) => (
                        <li key={index}>
                          {formatTime(data.timestamp)} - {data.frequency} skips
                        </li>
                      ))}
                  </ul>
                </div>
                
                <div className="insight">
                  <h4>Most Exciting Sections:</h4>
                  <ul>
                    {analytics.analytics.skipBackwardData
                      .sort((a, b) => b.frequency - a.frequency)
                      .slice(0, 3)
                      .map((data, index) => (
                        <li key={index}>
                          {formatTime(data.timestamp)} - {data.frequency} rewinds
                        </li>
                      ))}
                  </ul>
                </div>
                
                <div className="insight">
                  <h4>Most Interesting Sections:</h4>
                  <ul>
                    {analytics.analytics.pauseData
                      .sort((a, b) => b.frequency - a.frequency)
                      .slice(0, 3)
                      .map((data, index) => (
                        <li key={index}>
                          {formatTime(data.timestamp)} - {data.frequency} pauses
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>All Videos Analytics</h2>
          <div className="videos-list">
            {videos.map(video => (
              <div key={video._id} className="video-analytics-item">
                <h3>{video.title}</h3>
                <div className="video-stats">
                  <span>Views: {video.views}</span>
                  <span>Keystrokes: {video.analytics?.totalKeystrokes || 0}</span>
                </div>
                <a href={`/analytics/${video._id}`} className="button">
                  View Detailed Analytics
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .analytics-header {
          background-color: #212121;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .analytics-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .keystroke-breakdown {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background-color: #1a1a1a;
          border-radius: 4px;
        }
        
        .breakdown-value.red {
          color: #ff4444;
          font-weight: bold;
        }
        
        .breakdown-value.cyan {
          color: #44ffff;
          font-weight: bold;
        }
        
        .breakdown-value.green {
          color: #44ff44;
          font-weight: bold;
        }
        
        .insights {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .insight h4 {
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        
        .insight ul {
          list-style: none;
          padding: 0;
        }
        
        .insight li {
          padding: 0.25rem 0;
          color: #aaaaaa;
        }
        
        .videos-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .video-analytics-item {
          background-color: #212121;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #303030;
        }
        
        .video-stats {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
          color: #aaaaaa;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
