import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeTable } from './config/table-storage.config';
import moodRoutes from './routes/mood.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for Angular frontend
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MoodTrackerPlus API is running' });
});

// API routes
app.use('/api/moods', moodRoutes);

// Start server
async function startServer() {
  try {
    // Initialize Azure Table Storage
    console.log('🔄 Initializing Azure Table Storage...');
    await initializeTable();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('✅ Server is running');
      console.log(`📍 API available at: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`😊 Moods API: http://localhost:${PORT}/api/moods`);
      console.log('\n💡 Make sure Azurite is running on port 10002 for local development');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

// Start the application
startServer();
