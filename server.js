const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
const videoRoutes = require('./routes/videos');
const analyticsRoutes = require('./routes/analytics');
const creatorRoutes = require('./routes/creator');

app.use('/api/videos', videoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/creator', creatorRoutes);

// So this Serves static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-algorithm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Socket.IO for real-time keystroke tracking
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle keystroke events
  socket.on('keystroke', (data) => {
    // Broadcast keystroke data to other clients (for testing)
    socket.broadcast.emit('keystroke-update', data);
    
    // Store keystroke data in database
    storeKeystrokeData(data);
  });

  // Handle video view events
  socket.on('video-view', (data) => {
    socket.broadcast.emit('view-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Function to store keystroke data
async function storeKeystrokeData(data) {
  try {
    const KeystrokeData = require('./models/KeystrokeData');
    const keystroke = new KeystrokeData(data);
    await keystroke.save();
    console.log('Keystroke data stored:', data);
  } catch (error) {
    console.error('Error storing keystroke data:', error);
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
