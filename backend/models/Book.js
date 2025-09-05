const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  priceText: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  ratingText: {
    type: String,
    required: true
  },
  detailPageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
bookSchema.index({ title: 'text' });
bookSchema.index({ price: 1 });
bookSchema.index({ rating: 1 });
bookSchema.index({ inStock: 1 });
bookSchema.index({ scrapedAt: 1 });

module.exports = mongoose.model('Book', bookSchema);