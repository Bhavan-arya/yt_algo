import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import TimelineVisualization from './TimelineVisualization';
import axios from 'axios';

const VideoPlayer = ({ onKeystroke, isRecording, setIsRecording }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [keystrokeHistory, setKeystrokeHistory] = useState([]);
  const playerRef = useRef(null);

  // Load videos on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  // Load sample videos for testing
  const loadVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
      if (response.data.length > 0) {
        setCurrentVideo(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      // Load sample videos if API fails
      const sampleVideos = [
        {
          _id: '1',
          title: 'Sample Video 1 - Technology Review',
          description: 'A sample video for testing the algorithm',
          duration: 300, // 5 minutes
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
          }
        },
        {
          _id: '2',
          title: 'Sample Video 2 - Tutorial',
          description: 'Another sample video for testing',
          duration: 480, // 8 minutes
          videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
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
          }
        }
      ];
      setVideos(sampleVideos);
      setCurrentVideo(sampleVideos[0]);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!currentVideo) return;

      const key = event.key.toLowerCase();
      
      if (key === 'l') {
        // Skip forward 5 seconds
        if (playerRef.current) {
          const newTime = Math.min(currentTime + 5, duration);
          playerRef.current.seekTo(newTime);
        }
        
        if (onKeystroke) {
          onKeystroke('L', currentTime, currentVideo._id);
        }
        
        setKeystrokeHistory(prev => [...prev, { key: 'L', timestamp: currentTime, time: Date.now() }]);
      } else if (key === 'j') { // Using 'j' instead of 'r' to avoid conflict with browser refresh
        // Skip backward 5 seconds
        if (playerRef.current) {
          const newTime = Math.max(currentTime - 5, 0);
          playerRef.current.seekTo(newTime);
        }
        
        if (onKeystroke) {
          onKeystroke('R', currentTime, currentVideo._id);
        }
        
        setKeystrokeHistory(prev => [...prev, { key: 'R', timestamp: currentTime, time: Date.now() }]);
      } else if (key === 'k') {
        // Pause/Play
        setPlaying(!playing);
        
        if (onKeystroke) {
          onKeystroke('K', currentTime, currentVideo._id);
        }
        
        setKeystrokeHistory(prev => [...prev, { key: 'K', timestamp: currentTime, time: Date.now() }]);
      }
    };

    if (isRecording) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentTime, duration, currentVideo, isRecording, onKeystroke, playing]);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendKeystrokeData = async (keystrokeData) => {
    try {
      await axios.post(`/api/videos/${currentVideo._id}/keystroke`, keystrokeData);
    } catch (error) {
      console.error('Error sending keystroke data:', error);
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-player">
        <div className={`keystroke-indicator ${isRecording ? 'active' : ''}`}>
          {isRecording ? 'Recording Keystrokes' : 'Click to Start Recording'}
        </div>
        
        <ReactPlayer
          ref={playerRef}
          url={currentVideo?.videoUrl}
          playing={playing}
          onProgress={handleProgress}
          onDuration={handleDuration}
          width="100%"
          height="400px"
          controls={true}
        />
        
        <div className="video-info">
          <h2>{currentVideo?.title}</h2>
          <p>{currentVideo?.description}</p>
          <div className="video-stats">
            <span>Duration: {formatTime(currentVideo?.duration || 0)}</span>
            <span>Views: {currentVideo?.views || 0}</span>
            <span>Current Time: {formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      <div className="controls">
        <button 
          className="button" 
          onClick={() => setIsRecording(!isRecording)}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <div className="keystroke-instructions">
          <h3>Keyboard Controls:</h3>
          <ul>
            <li><strong>L</strong> - Skip forward 5 seconds (Red highlight)</li>
            <li><strong>J</strong> - Skip backward 5 seconds (Cyan highlight)</li>
            <li><strong>K</strong> - Pause/Play (Green highlight)</li>
          </ul>
        </div>
      </div>

      {currentVideo && (
        <TimelineVisualization 
          video={currentVideo}
          currentTime={currentTime}
          duration={duration}
        />
      )}

      <div className="video-list">
        <h3>Available Videos:</h3>
        {videos.map(video => (
          <div 
            key={video._id} 
            className={`video-item ${currentVideo?._id === video._id ? 'active' : ''}`}
            onClick={() => setCurrentVideo(video)}
          >
            <h4>{video.title}</h4>
            <p>{video.description}</p>
            <span>Duration: {formatTime(video.duration)} | Views: {video.views}</span>
          </div>
        ))}
      </div>

      <div className="keystroke-history">
        <h3>Recent Keystrokes:</h3>
        {keystrokeHistory.slice(-10).map((keystroke, index) => (
          <div key={index} className="keystroke-item">
            <span className="key">{keystroke.key}</span>
            <span className="timestamp">{formatTime(keystroke.timestamp)}</span>
            <span className="time">{new Date(keystroke.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
