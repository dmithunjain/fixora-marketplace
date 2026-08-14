const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider',
    default: null 
  },
  ticketNumber: { type: String, unique: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['booking', 'payment', 'service', 'provider', 'refund', 'complaint', 'general', 'other'],
    default: 'general'
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['open', 'pending', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  attachments: [{ type: String }],
  responses: [{
    message: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

supportTicketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.ticketNumber) {
    this.ticketNumber = 'TKT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
