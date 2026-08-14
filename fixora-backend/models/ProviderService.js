const mongoose = require('mongoose');

const providerServiceSchema = new mongoose.Schema({
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true 
  },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "30 mins", "1.5 hrs"
  location: {
    state: String,
    city: String,
    area: String,
    fullAddress: String
  },
  serviceType: { 
    type: String, 
    enum: ['home', 'online', 'both'], 
    default: 'both' 
  },
  images: [{ type: String }],
  availability: [{
    day: { type: String },
    from: { type: String },
    to: { type: String },
    isAvailable: { type: Boolean, default: true }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rejectionReason: { type: String },
  isActive: { type: Boolean, default: true },
  adminPlacement: {
    showInHome: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    category: { type: String },
    location: { type: String }
  },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

providerServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ProviderService', providerServiceSchema);
