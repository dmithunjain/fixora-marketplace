const mongoose = require('mongoose');

const providerVerificationSchema = new mongoose.Schema({
  provider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Provider', 
    required: true,
    unique: true
  },
  bankDetails: {
    accountNumber: { type: String },
    accountName: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    isVerified: { type: Boolean, default: false }
  },
  upiId: { type: String },
  businessDocuments: [{
    documentType: { type: String },
    documentNumber: String,
    documentImage: String,
    isVerified: { type: Boolean, default: false }
  }],
  businessName: { type: String },
  businessDescription: { type: String },
  businessAddress: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String
  },
  isApproved: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending' 
  },
  rejectionReason: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('ProviderVerification', providerVerificationSchema);
