const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderService' },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['upi', 'card', 'cod'],
    required: true 
  },
  upiId: { type: String },
  qrCode: { type: String },
  expiresAt: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'verified', 'failed', 'expired'],
    default: 'pending' 
  },
  transactionId: { type: String },
  order_id: { 
    type: String,
    default: function() {
      return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  payment_id: { 
    type: String, 
    unique: true,
    default: function() {
      return 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  cardDetails: {
    last4: String,
    bankName: String,
    cardHolderName: String
  },
  bookingDetails: {
    bookingDate: String,
    bookingTime: String,
    address: mongoose.Schema.Types.Mixed,
    customerDetails: mongoose.Schema.Types.Mixed,
    notes: String
  },
  paymentNotes: { type: String },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Ensure payment_id is never null or empty
  if (!this.payment_id) {
    this.payment_id = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  
  // Ensure order_id is never null or empty
  if (!this.order_id) {
    this.order_id = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  
  next();
});

// Virtual to get paymentId (camelCase) for API compatibility
paymentSchema.virtual('paymentId').get(function() {
  return this.payment_id || this._id.toHexString();
});

// Ensure virtuals are included when converting to JSON
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
