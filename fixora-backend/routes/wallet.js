const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const Notification = require('../models/Notification');
const CompanyEarning = require('../models/CompanyEarning');
const { protect, adminProtect } = require('../middleware/auth');

const COMMISSION_PERCENT = 30;

const createNotification = async (providerId, type, title, message) => {
  await Notification.create({
    recipient: providerId,
    recipientModel: 'Provider',
    type,
    title,
    message
  });
};

// Get provider wallet
router.get('/', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    let wallet = await Wallet.findOne({ provider: provider._id });
    if (!wallet) {
      wallet = await Wallet.create({ provider: provider._id });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to pending balance (called when payment is completed)
router.post('/add-pending', protect, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    let wallet = await Wallet.findOne({ provider: provider._id });
    if (!wallet) {
      wallet = await Wallet.create({ provider: provider._id });
    }

    wallet.pendingBalance += parseFloat(amount);
    wallet.totalEarnings += parseFloat(amount);
    await wallet.save();

    // Update booking payment status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        providerEarnings: parseFloat(amount)
      });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Move from pending to available (called when service is completed)
router.post('/release-funds', protect, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const wallet = await Wallet.findOne({ provider: provider._id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.pendingBalance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient pending balance' });
    }

    wallet.pendingBalance -= parseFloat(amount);
    wallet.balance += parseFloat(amount);
    await wallet.save();

    // Update booking status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'completed' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request withdrawal
router.post('/withdraw', protect, [
  body('amount').isNumeric(),
  body('paymentMethod').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { amount, paymentMethod, bankDetails, upiId } = req.body;
    
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const wallet = await Wallet.findOne({ provider: provider._id });
    if (!wallet || wallet.balance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Move amount from balance to pending (hold the funds)
    wallet.balance -= parseFloat(amount);
    wallet.pendingBalance += parseFloat(amount);
    await wallet.save();

    // Keep amount in pending balance - will be deducted when admin approves
    const withdrawal = await Withdrawal.create({
      provider: provider._id,
      amount: parseFloat(amount),
      paymentMethod,
      bankDetails: paymentMethod === 'bank_transfer' ? bankDetails : undefined,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
      status: 'pending'
    });

    // Create notification for admin
    await createNotification(
      provider._id,
      'withdrawal',
      'Withdrawal Request',
      `Provider ${provider.businessName} requested withdrawal of ₹${amount}`
    );

    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get withdrawal history
router.get('/withdrawals', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const withdrawals = await Withdrawal.find({ provider: provider._id })
      .sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all withdrawal requests
router.get('/admin/withdrawals', adminProtect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const withdrawals = await Withdrawal.find(filter)
      .populate('provider')
      .sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Approve withdrawal
router.post('/admin/withdraw/approve', adminProtect, async (req, res) => {
  try {
    const { withdrawalId } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId)
      .populate('provider', 'fullName businessName');
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    const grossAmount = withdrawal.amount;
    const commission = Math.round(grossAmount * (COMMISSION_PERCENT / 100));
    const netAmount = grossAmount - commission;

    // Deduct from provider's pending balance (money was already held when withdrawal was requested)
    const wallet = await Wallet.findOne({ provider: withdrawal.provider });
    if (wallet && wallet.pendingBalance >= grossAmount) {
      wallet.pendingBalance -= grossAmount;
      await wallet.save();
    }

    withdrawal.status = 'completed';
    withdrawal.processedAt = new Date();
    withdrawal.commission = commission;
    withdrawal.netAmount = netAmount;
    await withdrawal.save();

    // Record company earnings
    await CompanyEarning.create({
      provider: withdrawal.provider,
      withdrawalId: withdrawal._id,
      amount: commission,
      grossWithdrawal: grossAmount,
      commissionPercent: COMMISSION_PERCENT,
      type: 'withdrawal_commission',
      description: `30% commission on withdrawal of ₹${grossAmount}. Net amount: ₹${netAmount} credited to provider.`
    });

    // Notify provider with commission details
    await createNotification(
      withdrawal.provider,
      'withdrawal',
      'Withdrawal Approved',
      `Your withdrawal request of ₹${grossAmount} has been approved. ₹${commission} (30%) commission deducted. Net amount ₹${netAmount} credited to your account.`
    );

    res.json({ message: 'Withdrawal approved', withdrawal, commission, netAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reject withdrawal
router.post('/admin/withdraw/reject', adminProtect, async (req, res) => {
  try {
    const { withdrawalId, reason } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    // Return amount to provider wallet balance (deduct from pending and add back to balance)
    const wallet = await Wallet.findOne({ provider: withdrawal.provider });
    if (wallet) {
      wallet.pendingBalance -= withdrawal.amount;
      wallet.balance += withdrawal.amount;
      await wallet.save();
    }

    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = reason;
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    // Notify provider
    await createNotification(
      withdrawal.provider,
      'withdrawal',
      'Withdrawal Rejected',
      `Your withdrawal request of ₹${withdrawal.amount} was rejected. Reason: ${reason || 'Not specified'}`
    );

    res.json({ message: 'Withdrawal rejected', withdrawal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get company earnings
router.get('/admin/company-earnings', adminProtect, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const earnings = await CompanyEarning.find(query)
      .populate('provider', 'fullName businessName email phone')
      .populate('withdrawalId', 'amount netAmount commission createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CompanyEarning.countDocuments(query);
    const totalAmount = await CompanyEarning.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      earnings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      totalEarnings: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get company earnings summary
router.get('/admin/company-earnings/summary', adminProtect, async (req, res) => {
  try {
    const totalEarnings = await CompanyEarning.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const byType = await CompanyEarning.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const thisMonth = await CompanyEarning.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalEarnings: totalEarnings[0]?.total || 0,
      thisMonthEarnings: thisMonth[0]?.total || 0,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = { total: item.total, count: item.count };
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Provider: Get withdrawal slip details (for PDF generation)
router.get('/withdrawal-slip/:id', protect, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('provider', 'fullName businessName email phone');

    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    // Verify the provider owns this withdrawal
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider || withdrawal.provider._id.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      withdrawalId: withdrawal._id,
      providerName: withdrawal.provider.fullName || withdrawal.provider.businessName,
      providerEmail: withdrawal.provider.email,
      providerPhone: withdrawal.provider.phone,
      grossAmount: withdrawal.amount,
      commission: withdrawal.commission || Math.round(withdrawal.amount * 0.3),
      netAmount: withdrawal.netAmount || (withdrawal.amount - Math.round(withdrawal.amount * 0.3)),
      commissionPercent: 30,
      bankDetails: withdrawal.bankDetails,
      upiId: withdrawal.upiId,
      status: withdrawal.status,
      requestDate: withdrawal.createdAt,
      processedDate: withdrawal.processedAt,
      companyName: 'Fixora',
      companyAddress: 'Bangalore, Karnataka, India'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
