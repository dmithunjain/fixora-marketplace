const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  address: {
    state: String,
    district: String,
    city: String,
    address: String,
    pincode: String
  },
  customerDetails: {
    name: String,
    email: String,
    phone: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: String,
  workProof: {
    image: String,
    description: String,
    uploadedAt: Date
  },
  notes: String,
  providerEarnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
