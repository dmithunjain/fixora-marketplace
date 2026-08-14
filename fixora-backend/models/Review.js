const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderService', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100 },
  comment: { type: String, maxlength: 500 },
  images: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ service: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
