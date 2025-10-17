import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    creatorId: 'creator_1' // Default creator for demo
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/videos', formData);
      setMessage('Video uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        creatorId: 'creator_1'
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage('Error uploading video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const sampleVideos = [
    {
      title: 'Sample Video 1 - Technology Review',
      description: 'A comprehensive review of the latest technology trends',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 300
    },
    {
      title: 'Sample Video 2 - Tutorial',
      description: 'Step-by-step tutorial for beginners',
      videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      duration: 480
    }
  ];

  const loadSampleVideo = (video) => {
    setFormData({
      ...formData,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      duration: video.duration
    });
  };

  return (
    <div className="video-upload">
      <h1>Upload New Video</h1>
      
      <div className="upload-section">
        <h2>Upload Form</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Video Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter video description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="videoUrl">Video URL:</label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (seconds):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              placeholder="300"
            />
          </div>

          <button 
            type="submit" 
            className="button" 
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="sample-videos">
        <h2>Sample Videos for Testing</h2>
        <p>Click on a sample video to load it into the form for testing purposes:</p>
        
        <div className="sample-videos-grid">
          {sampleVideos.map((video, index) => (
            <div key={index} className="sample-video-card">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <div className="sample-video-info">
                <span>Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <button 
                className="button"
                onClick={() => loadSampleVideo(video)}
              >
                Load This Video
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="instructions">
        <h2>How to Use the Algorithm</h2>
        <div className="instructions-content">
          <div className="instruction-step">
            <h3>1. Upload Your Video</h3>
            <p>Upload your video using the form above. You can use the sample videos for testing.</p>
          </div>
          
          <div className="instruction-step">
            <h3>2. View Your Video</h3>
            <p>Go to the main page and select your video from the list.</p>
          </div>
          
          <div className="instruction-step">
            <h3>3. Start Recording Keystrokes</h3>
            <p>Click "Start Recording" and use the keyboard controls while watching:</p>
            <ul>
              <li><strong>L</strong> - Skip forward 5 seconds (marks content as boring)</li>
              <li><strong>J</strong> - Skip backward 5 seconds (marks content as exciting)</li>
              <li><strong>K</strong> - Pause/Play (marks content as interesting)</li>
            </ul>
          </div>
          
          <div className="instruction-step">
            <h3>4. Analyze Results</h3>
            <p>View the timeline visualization and analytics to understand viewer engagement patterns.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .upload-section {
          background-color: #212121;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .upload-form {
          max-width: 600px;
        }
        
        .message {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 4px;
          font-weight: bold;
        }
        
        .message.success {
          background-color: #1a4d1a;
          color: #44ff44;
          border: 1px solid #44ff44;
        }
        
        .message.error {
          background-color: #4d1a1a;
          color: #ff4444;
          border: 1px solid #ff4444;
        }
        
        .sample-videos {
          background-color: #212121;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .sample-videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
        
        .sample-video-card {
          background-color: #1a1a1a;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #303030;
        }
        
        .sample-video-card h3 {
          color: #ffffff;
          margin-bottom: 1rem;
        }
        
        .sample-video-card p {
          color: #aaaaaa;
          margin-bottom: 1rem;
        }
        
        .sample-video-info {
          margin-bottom: 1rem;
          color: #aaaaaa;
        }
        
        .instructions {
          background-color: #212121;
          padding: 2rem;
          border-radius: 8px;
        }
        
        .instructions-content {
          margin-top: 1rem;
        }
        
        .instruction-step {
          margin-bottom: 2rem;
          padding: 1rem;
          background-color: #1a1a1a;
          border-radius: 8px;
        }
        
        .instruction-step h3 {
          color: #ff0000;
          margin-bottom: 0.5rem;
        }
        
        .instruction-step p {
          color: #aaaaaa;
          margin-bottom: 0.5rem;
        }
        
        .instruction-step ul {
          color: #aaaaaa;
          margin-left: 2rem;
        }
        
        .instruction-step li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
};

export default VideoUpload;
