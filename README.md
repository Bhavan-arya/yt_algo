# YouTube Algorithm Analyzer

A sophisticated YouTube algorithm that analyzes user keystrokes to provide creators with valuable feedback about their content engagement. This system captures user interactions (L, J, K keys) during video playback and generates visual analytics to help creators understand viewer behavior patterns.

## Project Overview

This project implements an innovative approach to content analytics by tracking user keystrokes during video viewing:

- **L Key (Skip Forward)**: Highlights content as potentially boring/skippable (Red)
- **J Key (Skip Backward)**: Highlights content as exciting/rewatchable (Cyan)
- **K Key (Pause)**: Highlights content as interesting/pausable (Green)

The algorithm aggregates data from multiple users to create comprehensive timeline visualizations that help creators identify:

- Boring sections that need improvement
- Exciting moments that resonate with viewers
- Interesting content that captures attention

## Features

### Core Functionality

- **Real-time Keystroke Tracking**: Captures L, J, K key presses during video playback
- **Timeline Visualization**: Color-coded timeline showing viewer engagement patterns
- **Data Aggregation**: Collects and averages keystroke data from multiple users
- **Analytics Dashboard**: Comprehensive analytics for creators
- **YouTube Clone**: Full-featured video player for testing

### Analytics Features

- **Engagement Metrics**: Track skip rates, rewind rates, and pause frequency
- **Timeline Analysis**: Visual representation of content performance
- **Creator Dashboard**: Overview of all video performance
- **Detailed Insights**: Identify specific timestamps for improvement

## Technology Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **RESTful API** for data management

### Frontend

- **React.js** with modern hooks
- **React Router** for navigation
- **Socket.IO Client** for real-time updates
- **Chart.js** for data visualization
- **React Player** for video playback
- **Styled Components** for styling

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd youtube-algorithm-analyzer
   ```

2. **Install server dependencies**

   ```bash
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```
   MONGODB_URI=mongodb://localhost:27017/youtube-algorithm
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the application**

   ```bash
   # Start both server and client
   npm run dev-all

   # Or start them separately
   npm run server  # Starts backend on port 5000
   npm run client  # Starts frontend on port 3000
   ```

## Usage

### For Testing the Algorithm

1. **Upload a Video**

   - Go to `/upload` page
   - Fill in video details or use sample videos
   - Click "Upload Video"

2. **Watch and Record Keystrokes**

   - Go to the main page (`/`)
   - Select your video from the list
   - Click "Start Recording"
   - Use keyboard controls while watching:
     - **L**: Skip forward 5 seconds (marks as boring)
     - **J**: Skip backward 5 seconds (marks as exciting)
     - **K**: Pause/Play (marks as interesting)

3. **View Analytics**
   - Go to `/analytics` to see overall analytics
   - Click on specific videos for detailed analysis
   - Check `/creator` for creator dashboard

### Keyboard Controls

- **L Key**: Skip forward 5 seconds → Red highlight (boring content)
- **J Key**: Skip backward 5 seconds → Cyan highlight (exciting content)
- **K Key**: Pause/Play → Green highlight (interesting content)

## Algorithm Details

### Keystroke Processing

1. **Data Collection**: Each keystroke is recorded with timestamp and video ID
2. **Timestamp Adjustment**:
   - L key: Highlights 5 seconds BEFORE the keystroke
   - J key: Highlights 5 seconds AFTER the keystroke
   - K key: Highlights the exact timestamp
3. **Data Aggregation**: Multiple user data is averaged to create comprehensive analytics
4. **Visualization**: Timeline segments are color-coded based on activity frequency

### Timeline Visualization

- **Red Segments**: Areas where users frequently skip forward (boring content)
- **Cyan Segments**: Areas where users frequently skip backward (exciting content)
- **Green Segments**: Areas where users frequently pause (interesting content)
- **Intensity**: Opacity indicates the frequency of keystroke activity

## Project Structure

```
youtube-algorithm-analyzer/
├── server.js                 # Main server file
├── package.json              # Server dependencies
├── models/                   # Database models
│   ├── KeystrokeData.js     # Keystroke data schema
│   ├── Video.js             # Video schema
│   └── Creator.js           # Creator schema
├── routes/                   # API routes
│   ├── videos.js            # Video management
│   ├── analytics.js         # Analytics endpoints
│   └── creator.js           # Creator endpoints
└── client/                   # React frontend
    ├── package.json         # Client dependencies
    ├── public/              # Static files
    └── src/
        ├── App.js           # Main app component
        ├── index.js         # Entry point
        ├── index.css        # Global styles
        └── components/      # React components
            ├── VideoPlayer.js
            ├── TimelineVisualization.js
            ├── AnalyticsDashboard.js
            ├── CreatorDashboard.js
            └── VideoUpload.js
```

## API Endpoints

### Videos

- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos` - Create new video
- `POST /api/videos/:id/keystroke` - Record keystroke data

### Analytics

- `GET /api/analytics/video/:id` - Get video analytics
- `GET /api/analytics/video/:id/timeline` - Get timeline data
- `GET /api/analytics/creator/:id` - Get creator analytics

### Creator

- `GET /api/creator/:id` - Get creator profile
- `POST /api/creator` - Create new creator
- `GET /api/creator/:id/dashboard` - Get dashboard data

## Features Showcase

### Timeline Visualization

The timeline shows real-time engagement patterns with:

- Color-coded segments indicating content type
- Intensity levels based on user activity
- Clickable segments for detailed analysis
- Real-time current time indicator

### Analytics Dashboard

Comprehensive analytics including:

- Total views and keystroke counts
- Engagement rate calculations
- Keystroke breakdown by type
- Timeline charts and insights
- Performance comparisons

### Creator Dashboard

Creator-focused features:

- Channel overview and metrics
- Top performing videos
- Most engaging content analysis
- Content insights and recommendations

## Testing

The system includes sample videos and data for testing:

- Pre-loaded sample videos with analytics data
- Demo creator account with multiple videos
- Sample keystroke data for visualization testing

## Future Enhancements

- **Machine Learning Integration**: AI-powered content analysis
- **Advanced Analytics**: More sophisticated engagement metrics
- **Content Recommendations**: Suggest improvements based on data
- **Multi-platform Support**: Extend to other video platforms
- **Real-time Collaboration**: Multiple users analyzing simultaneously

## Open Source Contributing is well appreciated

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YouTube for the inspiration
- React and Node.js communities
- MongoDB for data storage
- Chart.js for visualization

---

**Note**: This is a demonstration project for educational purposes. For production use, additional security, scalability, and privacy considerations yet to be implemented.
