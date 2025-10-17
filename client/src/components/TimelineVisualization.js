import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimelineVisualization = ({ video, currentTime, duration }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimelineData();
  }, [video]);

  const loadTimelineData = async () => {
    try {
      if (video._id && video._id !== '1' && video._id !== '2') {
        const response = await axios.get(`/api/analytics/video/${video._id}/timeline`);
        setTimelineData(response.data.timeline);
      } else {
        // Generate sample timeline data for demo videos
        setTimelineData(generateSampleTimelineData());
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading timeline data:', error);
      setTimelineData(generateSampleTimelineData());
      setLoading(false);
    }
  };

  const generateSampleTimelineData = () => {
    const segments = [];
    const segmentDuration = 1; // 1 second segments
    const numSegments = Math.ceil(duration / segmentDuration);

    for (let i = 0; i < numSegments; i++) {
      const startTime = i * segmentDuration;
      const endTime = Math.min((i + 1) * segmentDuration, duration);

      let skipForward = 0;
      let skipBackward = 0;
      let pauses = 0;
      let color = null;

      // Simulate some activity based on video analytics
      if (video.analytics) {
        // Check skip forward data
        video.analytics.skipForwardData?.forEach(data => {
          const targetTime = Math.max(0, data.timestamp - 5);
          if (targetTime >= startTime && targetTime < endTime) {
            skipForward = data.frequency;
          }
        });

        // Check skip backward data
        video.analytics.skipBackwardData?.forEach(data => {
          const targetTime = data.timestamp + 5;
          if (targetTime >= startTime && targetTime < endTime) {
            skipBackward = data.frequency;
          }
        });

        // Check pause data
        video.analytics.pauseData?.forEach(data => {
          if (data.timestamp >= startTime && data.timestamp < endTime) {
            pauses = data.frequency;
          }
        });
      }

      // Determine color based on activity
      const totalActivity = skipForward + skipBackward + pauses;
      if (totalActivity > 0) {
        if (skipForward > skipBackward && skipForward > pauses) {
          color = 'red';
        } else if (skipBackward > skipForward && skipBackward > pauses) {
          color = 'cyan';
        } else if (pauses > 0) {
          color = 'green';
        }
      }

      segments.push({
        startTime,
        endTime,
        skipForward,
        skipBackward,
        pauses,
        intensity: totalActivity,
        color
      });
    }

    return segments;
  };

  const handleTimelineClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickTime = (clickX / rect.width) * duration;
    
    // This could trigger seeking to that time
    console.log('Timeline clicked at:', clickTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="timeline-container">
        <h3>Timeline Analysis</h3>
        <div>Loading timeline data...</div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <h3>Timeline Analysis</h3>
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color red"></div>
          <span>Boring/Skippable Content (L key pressed)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cyan"></div>
          <span>Exciting/Rewatchable Content (J key pressed)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color green"></div>
          <span>Interesting/Pausable Content (K key pressed)</span>
        </div>
      </div>

      <div className="timeline" onClick={handleTimelineClick}>
        {timelineData.map((segment, index) => {
          const leftPercent = (segment.startTime / duration) * 100;
          const widthPercent = ((segment.endTime - segment.startTime) / duration) * 100;

          return (
            <div
              key={index}
              className={`timeline-segment ${segment.color || ''}`}
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                height: '100%',
                opacity: segment.intensity > 0 ? Math.min(0.3 + (segment.intensity * 0.1), 1) : 0
              }}
              title={`${formatTime(segment.startTime)} - ${formatTime(segment.endTime)}
                Skip Forward: ${segment.skipForward}
                Skip Backward: ${segment.skipBackward}
                Pauses: ${segment.pauses}`}
            />
          );
        })}
        
        {/* Current time indicator */}
        <div
          className="current-time-indicator"
          style={{
            left: `${(currentTime / duration) * 100}%`,
            height: '100%',
            width: '2px',
            backgroundColor: '#ffffff',
            position: 'absolute',
            zIndex: 10
          }}
        />
      </div>

      <div className="timeline-stats">
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Total Segments:</span>
            <span className="stat-value">{timelineData.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Active Segments:</span>
            <span className="stat-value">
              {timelineData.filter(seg => seg.intensity > 0).length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Boring Areas:</span>
            <span className="stat-value">
              {timelineData.filter(seg => seg.color === 'red').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Exciting Areas:</span>
            <span className="stat-value">
              {timelineData.filter(seg => seg.color === 'cyan').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Interesting Areas:</span>
            <span className="stat-value">
              {timelineData.filter(seg => seg.color === 'green').length}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-stats {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #1a1a1a;
          border-radius: 4px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .stat {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
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
        
        .current-time-indicator {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default TimelineVisualization;
