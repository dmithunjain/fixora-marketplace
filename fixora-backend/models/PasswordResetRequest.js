const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  resetToken: { type: String },
  resetTokenExpire: { type: Date },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  rejectionReason: { type: String }
});

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
