const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  fullName: String,
  email: String,
  serviceCategory: { type: String, required: true },
  description: String,
  experience: Number,
  city: String,
  hourlyRate: Number,
  address: {
    state: String,
    district: String,
    address: String,
    pincode: String,
    city: String,
    area: String
  },
  aadharNumber: String,
  phone: String,
  isApproved: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  blockReason: String,
  blockedAt: Date,
  welcomed: { type: Boolean, default: false },
  firstLoginAfterApproval: { type: Boolean, default: false },
  kycStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  
  // Bank Account Details
  bankDetails: {
    accountNumber: String,
    accountName: String,
    accountHolderName: String,
    bankName: String,
    bankId: String,
    ifscCode: String,
    mobileNumber: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verificationDate: Date,
    rejectionReason: String,
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // PAN Details
  panDetails: {
    panNumber: String,
    panName: String,
    dob: String,
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // UPI Details
  upiDetails: {
    upiId: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    rejectionReason: String,
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Certificate
  certificate: String,
  
  // Profile Image
  profileImage: String,
  
  // Bank Statement Document
  bankStatement: String,
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
