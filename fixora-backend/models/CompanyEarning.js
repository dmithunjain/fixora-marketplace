const mongoose = require('mongoose');

const companyEarningSchema = new mongoose.Schema({
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider' 
  },
  withdrawalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Withdrawal' 
  },
  amount: { type: Number, required: true },
  grossWithdrawal: { type: Number, required: true },
  commissionPercent: { type: Number, default: 30 },
  type: { 
    type: String, 
    enum: ['withdrawal_commission', 'booking_commission', 'other'],
    default: 'withdrawal_commission'
  },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

companyEarningSchema.index({ createdAt: -1 });
companyEarningSchema.index({ provider: 1 });

module.exports = mongoose.model('CompanyEarning', companyEarningSchema);
