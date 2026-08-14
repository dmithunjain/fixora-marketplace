const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // For users
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // For providers (can be Provider or User with provider role)
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  recipientModel: { type: String, enum: ['Provider', 'User'], default: 'User' },
  // Content
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['booking', 'payment', 'review', 'system', 'promotion', 'account', 'withdrawal'],
    default: 'system' 
  },
  isRead: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
