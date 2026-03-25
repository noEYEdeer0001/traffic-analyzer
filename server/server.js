require('dotenv').config({ path: __dirname + '/.env' });
console.log("ENV CHECK:", process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Visit = require('./models/Visit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Track visit
app.post('/track', async (req, res) => {
  try {
    const { ip, pageUrl, deviceType, userAgent } = req.body;
    
    if (!ip || !pageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const visit = new Visit({
      ip,
      pageUrl,
      deviceType,
      userAgent
    });

    await visit.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ error: 'Failed to track visit' });
  }
});

// Get stats
app.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total visitors
    const totalVisitors = await Visit.countDocuments();

    // Unique visitors (distinct IPs)
    const uniqueVisitors = await Visit.distinct('ip').then(ips => ips.length);

    // Daily visitors (last 24h)
    const daily = await Visit.countDocuments({ timestamp: { $gte: oneDayAgo } });

    // Weekly (last 7 days)
    const weekly = await Visit.countDocuments({ timestamp: { $gte: oneWeekAgo } });

    // Monthly (last 30 days)
    const monthly = await Visit.countDocuments({ timestamp: { $gte: oneMonthAgo } });

    // Top 5 pages
    const topPages = await Visit.aggregate([
      { $match: { timestamp: { $gte: oneMonthAgo } } },
      { $group: { _id: '$pageUrl', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { page: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      totalVisitors,
      uniqueVisitors,
      daily,
      weekly,
      monthly,
      topPages: topPages || []
    });
  } catch (error) {
    console.error('Stats error:', error);
    // Fallback safe values
    res.json({
      totalVisitors: 0,
      uniqueVisitors: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      topPages: []
    });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

