const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true,
    unique: true
  },
  balance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

walletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Wallet', walletSchema);
