const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true  // For unique IP queries
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true  // For time-based aggregations
  },
  pageUrl: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,  // 'mobile', 'desktop', 'tablet'
    default: 'unknown'
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for aggregations
visitSchema.index({ timestamp: 1, ip: 1 });

module.exports = mongoose.model('Visit', visitSchema);

