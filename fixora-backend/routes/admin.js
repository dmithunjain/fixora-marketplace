const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Notification = require('../models/Notification');
const ServicePlacement = require('../models/ServicePlacement');
const Payment = require('../models/Payment');
const Admin = require('../models/Admin');
const { adminProtect } = require('../middleware/auth');
const { createNotification } = require('../utils/notificationUtils');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const adminUser = await Admin.findOne({ email });
    
    if (adminUser && (await adminUser.matchPassword(password))) {
      const token = jwt.sign(
        { id: adminUser._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      
      res.json({
        _id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'admin',
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', adminProtect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProviders = await Provider.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const pendingApprovals = await Provider.countDocuments({ verificationStatus: 'pending' });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    // Calculate monthly growth
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    
    const currentMonthRevenue = await Booking.aggregate([
      { $match: { 
        paymentStatus: 'paid',
        createdAt: { $gte: currentMonthStart }
      }},
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const previousMonthRevenue = await Booking.aggregate([
      { $match: { 
        paymentStatus: 'paid',
        createdAt: { 
          $gte: previousMonthStart,
          $lte: previousMonthEnd
        }
      }},
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    let monthlyGrowth = 0;
    if (previousMonthRevenue[0]?.total && previousMonthRevenue[0].total > 0) {
      monthlyGrowth = (((currentMonthRevenue[0]?.total || 0) - previousMonthRevenue[0].total) / previousMonthRevenue[0].total) * 100;
    }
    
    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      completedBookings,
      pendingBookings,
      pendingApprovals,
      blockedUsers,
      totalRevenue: revenue[0]?.total || 0,
      monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
      pendingPayments: await Provider.countDocuments({ isAvailable: false }) // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/providers', adminProtect, async (req, res) => {
  try {
    const { status, isApproved } = req.query;
    const filter = {};
    if (status) filter.verificationStatus = status;
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    
    const providers = await Provider.find(filter).populate('userId', 'name email phone isBlocked');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get providers with pending bank verification
router.get('/providers/bank-pending', adminProtect, async (req, res) => {
  try {
    const providers = await Provider.find({
      $and: [
        {
          $or: [
            { 'bankDetails.accountNumber': { $exists: true, $ne: '' } },
            { 'upiDetails.upiId': { $exists: true, $ne: '' } }
          ]
        },
        {
          $or: [
            { 'bankDetails.isVerified': { $ne: true } },
            { 'upiDetails.isVerified': { $ne: true } },
            { 'bankDetails.verificationStatus': 'pending' },
            { 'upiDetails.verificationStatus': 'pending' }
          ]
        }
      ]
    }).populate('userId', 'name email phone');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject provider
router.put('/provider/:id/approve', adminProtect, async (req, res) => {
  const { isApproved, reason } = req.body;
  
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Only set firstLoginAfterApproval if this is the first time being approved
    const wasNotApproved = !provider.isApproved;
    
    provider.isApproved = isApproved;
    provider.verificationStatus = isApproved ? 'approved' : 'rejected';
    
    // Set firstLoginAfterApproval flag only on first approval
    if (isApproved && wasNotApproved) {
      provider.firstLoginAfterApproval = true;
      provider.welcomed = false; // Reset welcome flag for first login
    }
    
    await provider.save();
    
    // Create notification for provider (only if userId exists)
    if (provider.userId) {
      await createNotification(
        provider.userId,
        isApproved ? 'Account Approved' : 'Account Rejected',
        isApproved 
          ? 'Your provider account has been approved! You can now login and start accepting jobs.'
          : `Your provider account has been rejected. Reason: ${reason || 'Please contact support for more information.'}`,
        'system'
      );
    }
    
    res.json({ 
      success: true, 
      message: isApproved ? 'Provider approved successfully' : 'Provider rejected',
      provider 
    });
  } catch (error) {
    console.error('Error in provider approval:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify provider (KYC/verification status)
router.put('/provider/:id/verify', adminProtect, async (req, res) => {
  const { status, reason } = req.body;
  
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved, rejected, or pending.' });
    }

    const wasNotApproved = !provider.isApproved;
    
    // Update provider status
    provider.verificationStatus = status;
    provider.kycStatus = status === 'approved' ? 'verified' : status === 'rejected' ? 'rejected' : 'pending';
    provider.isApproved = status === 'approved';
    
    // Set firstLoginAfterApproval flag only on first approval
    if (status === 'approved' && wasNotApproved) {
      provider.firstLoginAfterApproval = true;
      provider.welcomed = false;
    }
    
    await provider.save();
    
    // Create notification for provider (only if userId exists)
    if (provider.userId) {
      try {
        await createNotification(
          provider.userId,
          status === 'approved' ? 'Account Verified' : status === 'rejected' ? 'Verification Failed' : 'Under Review',
          status === 'approved' 
            ? 'Your provider account has been verified! You can now login and start accepting jobs.'
            : status === 'rejected' 
              ? `Your provider account verification failed. Reason: ${reason || 'Please contact support for more information.'}`
              : 'Your provider account is under review.',
          'system'
        );
      } catch (notifError) {
        console.error('Notification creation failed:', notifError);
        // Don't fail the main operation if notification fails
      }
    }
    
    res.json({ 
      success: true, 
      message: `Provider ${status === 'approved' ? 'verified' : status === 'rejected' ? 'rejected' : 'updated'} successfully`,
      provider 
    });
  } catch (error) {
    console.error('Error in provider verification:', error);
    res.status(500).json({ message: error.message });
  }
});

// Block/Unblock provider with reason
router.put('/provider/:id/block', adminProtect, async (req, res) => {
  const { isBlocked, reason } = req.body;
  
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    provider.isBlocked = isBlocked;
    
    if (isBlocked && reason) {
      provider.blockReason = reason;
      provider.blockedAt = new Date();
    } else if (!isBlocked) {
      provider.blockReason = null;
      provider.blockedAt = null;
    }
    
    await provider.save();
    
    // Create notification for provider (only if userId exists)
    if (provider.userId) {
      try {
        await createNotification(
          provider.userId,
          isBlocked ? 'Account Blocked' : 'Account Unblocked',
          isBlocked 
            ? `Your provider account has been blocked. Reason: ${reason || 'Please contact support for more information.'}`
            : 'Your provider account has been unblocked. You can now access your account.',
          'system'
        );
      } catch (notifError) {
        console.error('Notification creation failed:', notifError);
        // Don't fail the main operation if notification fails
      }
    }
    
    res.json({ 
      success: true, 
      message: isBlocked ? 'Provider blocked successfully' : 'Provider unblocked successfully',
      provider 
    });
  } catch (error) {
    console.error('Error in provider block/unblock:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete provider (only blocked providers can be deleted)
router.delete('/provider/:id', adminProtect, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Only allow deletion of blocked providers
    if (!provider.isBlocked) {
      return res.status(400).json({ message: 'Only blocked providers can be deleted. Please block the provider first.' });
    }

    const userId = provider.userId;

    // Delete related data
    await Booking.deleteMany({ provider: provider._id });
    await Notification.deleteMany({ user: userId });
    
    // Delete the provider
    await Provider.findByIdAndDelete(provider._id);
    
    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ 
      message: 'Provider and associated user account deleted successfully. The user can now register a new account with the same details.' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/bookings', adminProtect, async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('service', 'name price images')
      .populate('provider', 'businessName phone email')
      .sort({ createdAt: -1 });
    
    // Get payment details for each booking
    const bookingsWithPayments = await Promise.all(bookings.map(async (booking) => {
      const payment = await Payment.findOne({ bookingId: booking._id });
      return {
        ...booking.toObject(),
        paymentDetails: payment || null,
        workProof: booking.workProof || null
      };
    }));
    
    res.json(bookingsWithPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/booking/:id/status', adminProtect, async (req, res) => {
  const { status } = req.body;
  
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user service provider');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/services', adminProtect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status === 'pending') {
      filter.$or = [{ status: 'pending' }, { deleteRequested: true }];
    } else if (status) {
      filter.status = status;
    }
    
    const services = await Service.find(filter).populate('provider');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending services for approval
router.get('/services/pending', adminProtect, async (req, res) => {
  try {
    const services = await Service.find({ isApproved: false }).populate('provider');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve service
router.put('/services/:id/approve', adminProtect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    service.isApproved = true;
    service.isAvailable = true;
    service.status = 'approved';
    service.approvedBy = req.user._id;
    service.approvedAt = new Date();
    await service.save();
    
    res.json({ message: 'Service approved', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject service
router.put('/services/:id/reject', adminProtect, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    service.isApproved = false;
    service.status = 'rejected';
    service.adminNotes = adminNotes || 'Rejected by admin';
    await service.save();
    
    res.json({ message: 'Service rejected', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove service (final admin delete)
router.delete('/services/:id', adminProtect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ message: 'Service removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider services for approval
router.get('/provider-services', adminProtect, async (req, res) => {
  try {
    const ProviderService = require('../models/ProviderService');
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    
    const services = await ProviderService.find(filter)
      .populate('provider', 'businessName serviceCategory')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject provider service
router.put('/provider-service/:id/approve', adminProtect, async (req, res) => {
  try {
    const ProviderService = require('../models/ProviderService');
    const { status, rejectionReason, adminPlacement } = req.body;
    
    const updateData = { status };
    if (rejectionReason) updateData.rejectionReason = rejectionReason;
    if (adminPlacement) updateData.adminPlacement = adminPlacement;
    
    const service = await ProviderService.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('provider', 'businessName');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service placement (featured, showInHome, priority)
router.put('/provider-service/:id/placement', adminProtect, async (req, res) => {
  try {
    const ProviderService = require('../models/ProviderService');
    const { showInHome, featured, priority, category, location } = req.body;
    
    const service = await ProviderService.findByIdAndUpdate(
      req.params.id,
      {
        adminPlacement: {
          showInHome: showInHome ?? false,
          featured: featured ?? false,
          priority: priority ?? 0,
          category,
          location
        }
      },
      { new: true }
    ).populate('provider', 'businessName');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories', adminProtect, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/categories', adminProtect, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/categories/:id', adminProtect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/user/:id/block', adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const wasBlocked = user.isBlocked;
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    // Create notification for user about block/unblock status
    await createNotification(
      user._id,
      user.isBlocked ? 'Account Blocked' : 'Account Unblocked',
      user.isBlocked ? 
        'Your account has been temporarily blocked. Please contact support for assistance.' :
        'Your account has been unblocked and you can now access Fixora services.',
      'system'
    );
    
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== SERVICE PLACEMENT ====================

// Get all service placements
router.get('/service-placement', adminProtect, async (req, res) => {
  try {
    const { targetPageId, isActive } = req.query;
    const filter = {};
    if (targetPageId) filter.targetPageId = targetPageId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const placements = await ServicePlacement.find(filter)
      .populate('serviceId', 'title price description images categoryId')
      .sort({ targetPageId: 1, displayOrder: 1 });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get placements by target page
router.get('/service-placement/page/:pageId', adminProtect, async (req, res) => {
  try {
    const placements = await ServicePlacement.find({ targetPageId: req.params.pageId, isActive: true })
      .populate('serviceId', 'title price description images categoryId')
      .sort({ displayOrder: 1 });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service placement
router.post('/service-placement', adminProtect, async (req, res) => {
  try {
    const { serviceId, targetPageId, targetPath, categoryId, subCategoryId, sectionKey, displayOrder, isActive } = req.body;

    // Check if service exists and is approved
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    if (!service.isApproved) {
      return res.status(400).json({ message: 'Service must be approved before publishing' });
    }

    const placement = await ServicePlacement.create({
      serviceId,
      targetPageId: String(targetPageId),
      targetPath: targetPath || `/service/${targetPageId}`,
      categoryId: categoryId || '',
      subCategoryId: subCategoryId || '',
      sectionKey: sectionKey || 'main',
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
      createdBy: req.user._id
    });

    // Update service as published
    service.isPublished = true;
    await service.save();

    res.status(201).json({ message: 'Service placed successfully', placement });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This service is already placed on this page' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update service placement
router.put('/service-placement/:id', adminProtect, async (req, res) => {
  try {
    const { targetPageId, targetPath, categoryId, subCategoryId, sectionKey, displayOrder, isActive } = req.body;

    const placement = await ServicePlacement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ message: 'Placement not found' });
    }

    if (targetPageId) placement.targetPageId = String(targetPageId);
    if (targetPath !== undefined) placement.targetPath = targetPath || `/service/${placement.targetPageId}`;
    if (categoryId !== undefined) placement.categoryId = categoryId;
    if (subCategoryId !== undefined) placement.subCategoryId = subCategoryId;
    if (sectionKey !== undefined) placement.sectionKey = sectionKey;
    if (displayOrder !== undefined) placement.displayOrder = displayOrder;
    if (isActive !== undefined) placement.isActive = isActive;
    placement.updatedAt = new Date();

    await placement.save();
    res.json({ message: 'Placement updated', placement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete service placement
router.delete('/service-placement/:id', adminProtect, async (req, res) => {
  try {
    const placement = await ServicePlacement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ message: 'Placement not found' });
    }

    // Update service as not published
    await Service.findByIdAndUpdate(placement.serviceId, { isPublished: false });

    await ServicePlacement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Placement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Password Reset Requests (Provider)
router.get('/password-reset-requests', adminProtect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const requests = await PasswordResetRequest.find(filter).populate('userId', 'name email').sort({ requestedAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/password-reset-requests/:id/approve', adminProtect, async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id).populate('userId', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already ' + request.status });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    request.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    request.resetTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    request.status = 'approved';
    request.approvedAt = Date.now();
    request.approvedBy = req.user._id;
    await request.save();

    const resetUrl = `http://localhost:3000/provider/reset-password/${resetToken}`;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        to: request.email,
        subject: 'Fixora - Password Reset Approved',
        html: `
          <h2>Password Reset Approved</h2>
          <p>Your request to reset your Fixora provider account password has been approved.</p>
          <p>Click the link below to set a new password (valid for 30 minutes):</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#667eea;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a>
        `
      });
    } else {
      console.log('\n========================================');
      console.log('PASSWORD RESET LINK (dev mode):');
      console.log(resetUrl);
      console.log('========================================\n');
    }

    res.json({ message: 'Password reset approved. Email sent to provider.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/password-reset-requests/:id/reject', adminProtect, async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already ' + request.status });
    }

    request.status = 'rejected';
    request.rejectedAt = Date.now();
    request.rejectionReason = req.body.reason || 'Request rejected by admin';
    await request.save();

    res.json({ message: 'Password reset request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
