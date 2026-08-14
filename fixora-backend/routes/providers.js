const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');
const ProviderVerification = require('../models/ProviderVerification');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { protect, adminProtect } = require('../middleware/auth');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const multer = require('multer');
const path = require('path');

const createProviderNotification = async (providerId, type, title, message) => {
  try {
    await Notification.create({
      recipient: providerId,
      recipientModel: 'Provider',
      type,
      title,
      message
    });
  } catch (err) {
    console.log('Notification error:', err.message);
  }
};

const createUserNotification = async (userId, type, title, message) => {
  try {
    await Notification.create({
      recipient: userId,
      recipientModel: 'User',
      type,
      title,
      message
    });
  } catch (err) {
    console.log('Notification error:', err.message);
  }
};

// Configure multer for certificate uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/certificates/');
  },
  filename: function(req, file, cb) {
    cb(null, 'cert_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed'));
  }
});

// Configure multer for profile & bank statement uploads
const profileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function(req, file, cb) {
    const prefix = file.fieldname === 'bankStatement' ? 'bank_' : 'profile_';
    cb(null, prefix + Date.now() + path.extname(file.originalname));
  }
});

const profileUpload = multer({ 
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) and PDF files are allowed'));
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const calculateProviderStats = async (providerId) => {
  const totalBookings = await Booking.countDocuments({ provider: providerId });
  const completedJobs = await Booking.countDocuments({ provider: providerId, status: 'completed' });
  const pendingJobs = await Booking.countDocuments({ provider: providerId, status: { $in: ['pending', 'confirmed', 'assigned', 'in_progress'] } });
  const cancelledJobs = await Booking.countDocuments({ provider: providerId, status: 'cancelled' });
  
  const earnings = await Booking.aggregate([
    { $match: { provider: providerId, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  
  const provider = await Provider.findById(providerId);
  
  return {
    totalBookings,
    completedJobs,
    pendingJobs,
    cancelledJobs,
    totalEarnings: earnings[0]?.total || 0,
    rating: provider?.rating || 0,
    totalReviews: provider?.totalReviews || 0
  };
};

// Provider registration with optional file upload
router.post('/register', upload.single('certificate'), [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('serviceCategory').notEmpty().withMessage('Service category is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, phone, password, serviceCategory, experience, city, pincode, aadhaar, pan } = req.body;
  
  try {
    console.log('Starting registration for:', email);
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    user = await User.create({
      name: fullName,
      email,
      phone,
      password: password,
      role: 'provider'
    });
    console.log('User created:', user._id, 'Role:', user.role);

    // Create provider profile
    let provider;
    try {
      provider = await Provider.create({
        userId: user._id,
        businessName: fullName,
        fullName: fullName,
        serviceCategory: serviceCategory,
        description: `Experienced ${serviceCategory} professional`,
        experience: parseInt(experience) || 0,
        hourlyRate: 500,
        phone: phone,
        email: email,
        city: city || '',
        address: {
          state: '',
          district: '',
          address: '',
          city: city || '',
          pincode: pincode || ''
        },
        aadharNumber: aadhaar || '',
        panDetails: {
          panNumber: pan || '',
          panName: fullName,
          isVerified: false
        },
        certificate: req.file ? req.file.path : null,
        verificationStatus: 'pending',
        isApproved: false,
        isAvailable: true
      });
      console.log('Provider created successfully:', provider._id);
    } catch (providerErr) {
      console.error('Provider creation error:', providerErr);
      // Delete user if provider creation fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: 'Failed to create provider profile: ' + providerErr.message });
    }

    const token = generateToken(user._id);
    console.log('Token generated for user:', user._id);
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      provider: {
        id: provider._id,
        businessName: provider.businessName,
        fullName: provider.fullName,
        serviceCategory: provider.serviceCategory,
        verificationStatus: provider.verificationStatus,
        isApproved: provider.isApproved
      }
    });
  } catch (error) {
    console.error('Provider registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Provider login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is a provider
    if (user.role !== 'provider') {
      return res.status(401).json({ message: 'Access denied. Provider account required.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const provider = await Provider.findOne({ userId: user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // Check if provider is blocked
    if (provider.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
    }

    // Check if provider is approved/verified
    if (!provider.isApproved) {
      return res.status(403).json({ 
        message: 'Your account is pending verification. Please wait for admin approval.',
        pendingVerification: true,
        verificationStatus: provider.verificationStatus
      });
    }

    const token = generateToken(user._id);
    
    // Check if this is the first login after approval
    const isFirstLoginAfterApproval = provider.firstLoginAfterApproval && !provider.welcomed;
    
    // Mark as welcomed after first login
    if (isFirstLoginAfterApproval) {
      provider.welcomed = true;
      await provider.save();
    }
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      provider: {
        id: provider._id,
        businessName: provider.businessName,
        serviceCategory: provider.serviceCategory,
        isApproved: provider.isApproved,
        verificationStatus: provider.verificationStatus,
        firstLoginAfterApproval: isFirstLoginAfterApproval
      }
    });
  } catch (error) {
    console.error('Provider login error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    const stats = await calculateProviderStats(provider._id);
    
    res.json({
      ...provider.toObject(),
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if provider is approved - lightweight endpoint
router.get('/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Not a provider' });
    }
    
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    res.json({
      isApproved: provider.isApproved,
      isBlocked: provider.isBlocked,
      verificationStatus: provider.verificationStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, profileUpload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 }
]), async (req, res) => {
  const { fullName, phone, city, service, bio, experience, bankAccountNumber, bankName, ifscCode } = req.body;
  
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    if (fullName) provider.fullName = fullName;
    if (phone) provider.phone = phone;
    if (city) provider.city = city;
    if (service) provider.serviceCategory = service;
    if (bio) provider.description = bio;
    if (experience) provider.experience = experience;
    if (bankAccountNumber || bankName || ifscCode) {
      provider.bankDetails = {
        ...provider.bankDetails,
        accountNumber: bankAccountNumber || provider.bankDetails?.accountNumber,
        bankName: bankName || provider.bankDetails?.bankName,
        ifscCode: ifscCode || provider.bankDetails?.ifscCode
      };
    }
    if (req.files?.profileImage) {
      provider.profileImage = req.files.profileImage[0].path;
    }
    if (req.files?.bankStatement) {
      provider.bankStatement = req.files.bankStatement[0].path;
    }
    
    await provider.save();
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Bank Details
router.put('/profile/bank-details', protect, async (req, res) => {
  const { accountNumber, accountName, accountHolderName, bankName, bankId, ifscCode, mobileNumber, upiId, remove } = req.body;
  
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    if (remove) {
      provider.bankDetails = {
        accountNumber: "",
        accountName: "",
        accountHolderName: "",
        bankName: "",
        bankId: "",
        ifscCode: "",
        mobileNumber: "",
        verificationStatus: 'pending',
        verificationDate: null,
        rejectionReason: null,
        isVerified: false,
        verifiedAt: null
      };
      await provider.save();
      return res.json({ message: 'Bank details removed', bankDetails: provider.bankDetails });
    }
    
    provider.bankDetails = {
      accountNumber,
      accountName,
      accountHolderName: accountHolderName || accountName,
      bankName,
      bankId,
      ifscCode,
      mobileNumber,
      verificationStatus: 'pending',
      verificationDate: Date.now(),
      rejectionReason: null,
      isVerified: false,
      verifiedAt: null
    };

    if (upiId) {
      provider.upiDetails = {
        upiId,
        isVerified: false,
        verificationStatus: 'pending',
        rejectionReason: null,
        verifiedAt: null
      };
    }
    
    await provider.save();
    res.json({ 
      message: 'Bank details submitted. Verification is in process.',
      bankDetails: provider.bankDetails,
      upiDetails: provider.upiDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update PAN Details
router.put('/profile/pan-details', protect, async (req, res) => {
  const { panNumber, panName, dob } = req.body;
  
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    provider.panDetails = {
      panNumber,
      panName,
      dob,
      isVerified: false,
      verifiedAt: null
    };
    
    await provider.save();
    res.json({ 
      message: 'PAN details updated successfully. Pending admin verification.',
      panDetails: provider.panDetails 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update UPI Details
router.put('/profile/upi-details', protect, async (req, res) => {
  const { upiId, remove } = req.body;
  
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    if (remove) {
      provider.upiDetails = {
        upiId: "",
        verificationStatus: 'pending',
        rejectionReason: null,
        isVerified: false,
        verifiedAt: null
      };
      await provider.save();
      return res.json({ message: 'UPI details removed', upiDetails: provider.upiDetails });
    }
    
    provider.upiDetails = {
      upiId,
      verificationStatus: 'pending',
      rejectionReason: null,
      isVerified: false,
      verifiedAt: null
    };
    
    await provider.save();
    res.json({ 
      message: 'UPI details updated successfully. Pending admin verification.',
      upiDetails: provider.upiDetails 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    const stats = await calculateProviderStats(provider._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/jobs', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    const { status } = req.query;
    const filter = { provider: provider._id };
    if (status) filter.status = status;
    
    const jobs = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('service')
      .sort({ createdAt: -1 });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/jobs/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, provider: provider._id },
      { status },
      { new: true }
    ).populate('user', 'name email phone').populate('service');
    
    if (!booking) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/jobs/:id/work-proof', protect, async (req, res) => {
  const { image, description } = req.body;
   
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
   
    // Find the booking first to check payment status
    const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
    if (!booking) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
   
    // Update booking with work proof and mark as completed
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.id, provider: provider._id },
      { 
        workProof: { image, description, uploadedAt: Date.now() },
        status: 'completed'
      },
      { new: true }
    ).populate('user', 'name email phone').populate('service');
   
    // For COD: Credit provider wallet when work proof is uploaded (payment happens on service)
    // For Online (UPI/Card): Funds already in pending, just release to available balance
    if (booking.paymentMethod === 'cod') {
      // For COD, credit provider wallet now (payment will be collected by provider)
      let wallet = await Wallet.findOne({ provider: provider._id });
      if (!wallet) {
        wallet = await Wallet.create({ provider: provider._id });
      }
      wallet.pendingBalance += booking.totalAmount;
      wallet.totalEarnings += booking.totalAmount;
      await wallet.save();

      // Update booking payment status to paid
      await Booking.findByIdAndUpdate(booking._id, {
        paymentStatus: 'paid',
        providerEarnings: booking.totalAmount
      });
    } else if (booking.paymentStatus === 'paid') {
      // For online payments already credited to pending, release to available
      const wallet = await Wallet.findOne({ provider: provider._id });
      if (wallet && wallet.pendingBalance >= booking.totalAmount) {
        wallet.pendingBalance -= booking.totalAmount;
        wallet.balance += booking.totalAmount;
        await wallet.save();
      }
    }

    // Mark provider earnings as released
    await Booking.findByIdAndUpdate(booking._id, {
      providerEarningsReleased: true
    });

    // Create notifications for provider and user
    await createProviderNotification(
      provider._id,
      'booking',
      'Work Completed',
      `Work for booking ${String(booking._id || '').slice(-8)} completed. Amount: ₹${booking.totalAmount}`
    );

    if (updatedBooking.user) {
      await createUserNotification(
        updatedBooking.user._id,
        'booking',
        'Service Completed',
        `Your service booking has been completed. Provider uploaded work proof.`
      );
    }
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error uploading work proof:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get provider verification status
router.get('/verification', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    let verification = await ProviderVerification.findOne({ provider: provider._id })
      .populate('reviewedBy', 'name');
    
    res.json(verification || { verificationStatus: 'not_submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit provider verification
router.post('/verification', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    const { bankDetails, upiId, businessDocuments, businessName, businessDescription, businessAddress } = req.body;
    
    let verification = await ProviderVerification.findOne({ provider: provider._id });
    
    if (verification) {
      verification.bankDetails = bankDetails || verification.bankDetails;
      verification.upiId = upiId || verification.upiId;
      verification.businessDocuments = businessDocuments || verification.businessDocuments;
      verification.businessName = businessName || verification.businessName;
      verification.businessDescription = businessDescription || verification.businessDescription;
      verification.businessAddress = businessAddress || verification.businessAddress;
      verification.verificationStatus = 'pending';
      verification.submittedAt = Date.now();
    } else {
      verification = await ProviderVerification.create({
        provider: provider._id,
        bankDetails,
        upiId,
        businessDocuments,
        businessName,
        businessDescription,
        businessAddress,
        verificationStatus: 'pending'
      });
    }
    
    await verification.save();
    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all verification requests
router.get('/verifications/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { status } = req.query;
    const filter = {};
    if (status) filter.verificationStatus = status;
    
    const verifications = await ProviderVerification.find(filter)
      .populate('provider')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 });
    
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Review verification
router.put('/verifications/:id/review', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { status, rejectionReason } = req.body;
    
    const verification = await ProviderVerification.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: status,
        rejectionReason,
        reviewedAt: Date.now(),
        reviewedBy: req.user._id,
        isApproved: status === 'approved',
        'bankDetails.isVerified': status === 'approved'
      },
      { new: true }
    ).populate('provider');
    
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    
    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Verify Bank Details
router.put('/admin/verify-bank/:id', adminProtect, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    provider.bankDetails.isVerified = true;
    provider.bankDetails.verificationStatus = 'verified';
    provider.bankDetails.rejectionReason = null;
    provider.bankDetails.verificationDate = Date.now();
    provider.bankDetails.verifiedAt = Date.now();
    provider.bankDetails.verifiedBy = req.user._id;
    
    await provider.save();
    res.json({ message: 'Bank details verified successfully', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Verify PAN Details
router.put('/admin/verify-pan/:id', adminProtect, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    provider.panDetails.isVerified = true;
    provider.panDetails.verifiedAt = Date.now();
    provider.panDetails.verifiedBy = req.user._id;
    
    await provider.save();
    res.json({ message: 'PAN details verified successfully', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Verify UPI Details
router.put('/admin/verify-upi/:id', adminProtect, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    provider.upiDetails.isVerified = true;
    provider.upiDetails.verificationStatus = 'verified';
    provider.upiDetails.rejectionReason = null;
    provider.upiDetails.verifiedAt = Date.now();
    provider.upiDetails.verifiedBy = req.user._id;
    
    await provider.save();
    res.json({ message: 'UPI details verified successfully', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reject Bank/PAN/UPI Details
router.put('/admin/reject-kyc/:id', adminProtect, async (req, res) => {
  try {
    const { type, reason } = req.body;
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    if (type === 'bank') {
      provider.bankDetails.isVerified = false;
      provider.bankDetails.verificationStatus = 'rejected';
      provider.bankDetails.rejectionReason = reason;
    } else if (type === 'pan') {
      provider.panDetails.isVerified = false;
      provider.panDetails.rejectionReason = reason;
    } else if (type === 'upi') {
      provider.upiDetails.isVerified = false;
      provider.upiDetails.verificationStatus = 'rejected';
      provider.upiDetails.rejectionReason = reason;
    }
    
    await provider.save();
    res.json({ message: `${type} details rejected`, provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check password reset request status by email
router.get('/password-reset-check/:email', async (req, res) => {
  try {
    const request = await PasswordResetRequest.findOne({ email: req.params.email }).sort({ requestedAt: -1 });
    if (!request) {
      return res.status(404).json({ message: 'No password reset request found for this email' });
    }
    res.json({
      status: request.status,
      requestedAt: request.requestedAt,
      approvedAt: request.approvedAt,
      rejectedAt: request.rejectedAt,
      rejectionReason: request.rejectionReason
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password after admin approval (no token needed - uses approved request by email)
router.post('/password-reset-change', async (req, res) => {
  const { email, password } = req.body;
  try {
    const request = await PasswordResetRequest.findOne({
      email,
      status: 'approved',
      $or: [
        { resetTokenExpire: { $gt: Date.now() } },
        { resetTokenExpire: { $exists: false } }
      ]
    }).sort({ requestedAt: -1 });

    if (!request) {
      return res.status(400).json({ message: 'No approved password reset request found. It may have expired.' });
    }

    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    request.status = 'approved';
    request.resetToken = undefined;
    request.resetTokenExpire = undefined;
    await request.save();

    res.json({ message: 'Password updated successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Password reset change error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Forgot Password - Provider (creates a pending request for admin approval)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email, role: 'provider' });
    if (!user) {
      return res.status(404).json({ message: 'No provider account found with this email' });
    }

    const existing = await PasswordResetRequest.findOne({ email, status: 'pending' });
    if (existing) {
      return res.json({ message: 'A password reset request is already pending admin approval. Please wait.' });
    }

    await PasswordResetRequest.create({
      email,
      userId: user._id
    });

    res.json({ message: 'Your request has been sent to admin for approval. You will receive an email once approved.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process request' });
  }
});

// Reset Password - Provider (uses the approved token)
router.put('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const request = await PasswordResetRequest.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
      status: 'approved'
    });

    if (!request) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    request.status = 'approved';
    request.resetToken = undefined;
    request.resetTokenExpire = undefined;
    await request.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

module.exports = router;
