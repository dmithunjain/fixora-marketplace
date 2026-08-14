const mongoose = require('mongoose');

const serviceHighlightSchema = new mongoose.Schema({
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ProviderService', 
    required: true 
  },
  highlightType: { 
    type: String, 
    enum: ['featured', 'most_booked', 'top_rated', 'new_arrival', 'seasonal_offer', 'none'],
    default: 'none'
  },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedAt: { type: Date, default: Date.now }
});

serviceHighlightSchema.index({ highlightType: 1, position: 1 });

module.exports = mongoose.model('ServiceHighlight', serviceHighlightSchema);
