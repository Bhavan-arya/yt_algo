import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
import VideoPlayer from './components/VideoPlayer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import VideoUpload from './components/VideoUpload';
import './index.css';

const socket = io('http://localhost:5000');

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [keystrokeData, setKeystrokeData] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Listen for keystroke updates from other users
    socket.on('keystroke-update', (data) => {
      console.log('Keystroke update received:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleKeystroke = (keyType, timestamp, videoId) => {
    if (!isRecording) return;

    const keystrokeInfo = {
      keyType,
      timestamp,
      videoId,
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      sessionId: 'session_' + Math.random().toString(36).substr(2, 9)
    };

    // Send keystroke data to server
    socket.emit('keystroke', keystrokeInfo);
    
    // Update local state
    setKeystrokeData(prev => [...prev, keystrokeInfo]);
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo">
                YouTube Algorithm Analyzer
              </Link>
              <nav className="nav">
                <Link to="/">Videos</Link>
                <Link to="/analytics">Analytics</Link>
                <Link to="/creator">Creator Dashboard</Link>
                <Link to="/upload">Upload Video</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <VideoPlayer 
                  onKeystroke={handleKeystroke}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
              } 
            />
            <Route 
              path="/analytics/:videoId" 
              element={<AnalyticsDashboard />} 
            />
            <Route 
              path="/analytics" 
              element={<AnalyticsDashboard />} 
            />
            <Route 
              path="/creator" 
              element={<CreatorDashboard />} 
            />
            <Route 
              path="/upload" 
              element={<VideoUpload />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
