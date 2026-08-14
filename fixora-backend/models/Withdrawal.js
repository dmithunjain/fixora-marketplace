const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true 
  },
  amount: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  netAmount: { type: Number },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: 'bank_transfer' },
  bankDetails: {
    accountNumber: String,
    accountName: String,
    bankName: String,
    ifscCode: String
  },
  upiId: String,
  rejectionReason: { type: String },
  processedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
