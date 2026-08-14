const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Wallet = require('../models/Wallet');
const Provider = require('../models/Provider');
const { protect, adminProtect } = require('../middleware/auth');
const QRCode = require('qrcode');
const mongoose = require('mongoose');

const FIXORA_UPI_ID = 'fixora@upi';
const UPI_EXPIRY_MINUTES = 5;

const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

const resolveServiceById = async (serviceId) => {
  if (!serviceId || !isValidObjectId(serviceId)) {
    return null;
  }
  return Service.findById(serviceId);
};

const normalizeAddress = (address = {}) => ({
  state: address?.state || '',
  district: address?.district || '',
  city: address?.city || '',
  address: address?.address || '',
  pincode: address?.pincode || ''
});

// Credit provider wallet immediately for online payments
const creditProviderWallet = async (providerId, amount, bookingId) => {
  console.log('[Wallet Credit] Attempting to credit:', { providerId: providerId?.toString(), amount, bookingId: bookingId?.toString() });
  
  if (!providerId) {
    console.log('[Wallet Credit] Skipped - no providerId');
    // Still update booking if we have bookingId
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        providerEarnings: 0
      });
    }
    return;
  }
  
  if (!amount) {
    console.log('[Wallet Credit] Skipped - no amount');
    return;
  }
  
  try {
    let wallet = await Wallet.findOne({ provider: providerId });
    if (!wallet) {
      try {
        wallet = await Wallet.create({ provider: providerId });
        console.log('[Wallet Credit] Created new wallet for provider:', providerId);
      } catch (createError) {
        if (createError.code === 11000) {
          wallet = await Wallet.findOne({ provider: providerId });
        } else {
          console.log('[Wallet Credit] Error creating wallet:', createError.message);
        }
      }
    }
    
    if (wallet) {
      wallet.pendingBalance = (wallet.pendingBalance || 0) + parseFloat(amount);
      wallet.totalEarnings = (wallet.totalEarnings || 0) + parseFloat(amount);
      await wallet.save();
      console.log('[Wallet Credit] SUCCESS - Wallet credited. New pending:', wallet.pendingBalance);
    }
    
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        providerEarnings: parseFloat(amount)
      });
      console.log('[Wallet Credit] Booking updated with paymentStatus: paid');
    }
  } catch (error) {
    console.error('[Wallet Credit] FAILED:', error.message);
  }
};

// Create UPI payment
router.post('/create-upi', protect, async (req, res) => {
  const { serviceId, amount, bookingDate, bookingTime, address, customerDetails, notes } = req.body;

  // Validate required fields
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }

  // Validate serviceId exists
  if (!serviceId || !isValidObjectId(serviceId)) {
    return res.status(400).json({ message: 'Valid service is required' });
  }

  try {
    // Step 1: Get provider from service
    let providerId = null;
    if (serviceId && isValidObjectId(serviceId)) {
      const service = await Service.findById(serviceId);
      providerId = service?.provider || null;
    }

    const expiresAt = new Date(Date.now() + UPI_EXPIRY_MINUTES * 60 * 1000);
    
    const upiUrl = `upi://pay?pa=${FIXORA_UPI_ID}&pn=Fixora&am=${amount}&cu=INR&tn=Booking for Fixora Service`;
    const qrCode = await QRCode.toDataURL(upiUrl);

    // Step 2: Create payment with providerId (no booking yet - booking created on payment confirmation)
    const payment = await Payment.create({
      userId: req.user._id,
      serviceId: serviceId && isValidObjectId(serviceId) ? serviceId : null,
      providerId: providerId || null,
      bookingId: null,
      amount: parseFloat(amount),
      paymentMethod: 'upi',
      upiId: FIXORA_UPI_ID,
      qrCode: qrCode,
      expiresAt: expiresAt,
      status: 'pending',
      transactionId: `UPI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentNotes: notes || (serviceId ? `Service ID: ${serviceId}` : 'UPI Payment')
    });

    // Store booking details in payment for later use
    payment.bookingDetails = {
      bookingDate,
      bookingTime,
      address,
      customerDetails,
      notes
    };
    await payment.save();

    res.json({
      paymentId: payment.paymentId,
      upiId: FIXORA_UPI_ID,
      qrCode: qrCode,
      amount: amount,
      expiresAt: expiresAt,
      upiUrl: upiUrl
    });
  } catch (error) {
    console.error('Error creating UPI payment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create Card payment
router.post('/create-card', protect, async (req, res) => {
  const { serviceId, amount, cardDetails, bookingDate, bookingTime, address, customerDetails, notes } = req.body;

  // Validate required fields
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }
  
  if (!cardDetails) {
    return res.status(400).json({ message: 'Card details are required' });
  }

  // Validate card details
  if (!cardDetails.cardNumber || cardDetails.cardNumber.trim() === '') {
    return res.status(400).json({ message: 'Card number is required' });
  }
  
  if (!cardDetails.expiry || cardDetails.expiry.trim() === '') {
    return res.status(400).json({ message: 'Card expiry is required' });
  }
  
  if (!cardDetails.cvv || cardDetails.cvv.trim() === '') {
    return res.status(400).json({ message: 'Card CVV is required' });
  }
  
  if (!cardDetails.cardHolderName || cardDetails.cardHolderName.trim() === '') {
    return res.status(400).json({ message: 'Cardholder name is required' });
  }

  // Validate serviceId exists
  if (!serviceId || !isValidObjectId(serviceId)) {
    return res.status(400).json({ message: 'Valid service is required' });
  }

  try {
    // Step 1: Validate and get service/provider
    let providerId = null;
    if (serviceId && isValidObjectId(serviceId)) {
      const service = await Service.findById(serviceId);
      if (service && service.provider) {
        providerId = service.provider;
      }
    }

    // Step 2: Create booking (allow booking even without provider assigned)
    let booking = null;
    if (serviceId && isValidObjectId(serviceId)) {
      booking = await Booking.create({
        user: req.user._id,
        service: serviceId,
        provider: providerId, // can be null for services without assigned provider
        bookingDate: bookingDate || new Date().toISOString().split('T')[0],
        bookingTime: bookingTime || '10:00 AM',
        address: normalizeAddress(address),
        customerDetails: {
          name: customerDetails?.name || req.user.name || '',
          email: customerDetails?.email || req.user.email || '',
          phone: customerDetails?.phone || req.user.phone || ''
        },
        totalAmount: parseFloat(amount),
        paymentMethod: 'card',
        paymentStatus: 'paid',
        notes: notes || '',
        status: 'confirmed'
      });
    }

    // Step 3: Create payment using bookingId and copy providerId from booking
    const payment = await Payment.create({
      userId: req.user._id,
      serviceId: serviceId && isValidObjectId(serviceId) ? serviceId : null,
      providerId: booking?.provider || providerId || null,
      bookingId: booking?._id || null,
      amount: parseFloat(amount),
      paymentMethod: 'card',
      status: 'paid',
      cardDetails: {
        last4: cardDetails.cardNumber?.slice(-4) || '0000',
        bankName: cardDetails.bankName || 'Unknown',
        cardHolderName: cardDetails.cardHolderName || 'Customer'
      },
      transactionId: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentNotes: notes || (serviceId ? `Service ID: ${serviceId}` : 'Direct booking')
    });

    // Step 4: Credit provider wallet (only if we have valid booking with provider)
    if (booking && booking.provider) {
      await creditProviderWallet(booking.provider, amount, booking._id);
    }

    res.json({
      paymentId: payment.paymentId,
      bookingId: payment.bookingId,
      amount: amount,
      status: 'paid',
      message: 'Card payment successful. Booking confirmed.'
    });
  } catch (error) {
    console.error('Error creating card payment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create COD (Cash on Service)
router.post('/create-cod', protect, async (req, res) => {
  const { serviceId, amount, bookingId, address, bookingDate, bookingTime, customerDetails, notes } = req.body;

  // Validate required fields
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }

  // Validate serviceId exists (required for COD)
  if (!serviceId || !isValidObjectId(serviceId)) {
    return res.status(400).json({ message: 'Valid service is required' });
  }

  try {
    // Step 1: Validate and get service/provider
    let providerId = null;
    if (serviceId && isValidObjectId(serviceId)) {
      const service = await Service.findById(serviceId);
      if (service && service.provider) {
        providerId = service.provider;
      }
    }

    // Step 2: Create booking (allow booking even without provider assigned)
    let booking = null;
    if (serviceId && isValidObjectId(serviceId)) {
      booking = await Booking.create({
        user: req.user._id,
        service: serviceId,
        provider: providerId, // can be null for services without assigned provider
        bookingDate: bookingDate || new Date().toISOString().split('T')[0],
        bookingTime: bookingTime || '10:00 AM',
        address: normalizeAddress(address),
        customerDetails: {
          name: customerDetails?.name || req.user.name || '',
          email: customerDetails?.email || req.user.email || '',
          phone: customerDetails?.phone || req.user.phone || ''
        },
        totalAmount: parseFloat(amount),
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        notes: notes || '',
        status: 'confirmed'
      });
    }

    // Step 3: Create payment using bookingId and copy providerId from booking
    const payment = await Payment.create({
      userId: req.user._id,
      serviceId: serviceId && isValidObjectId(serviceId) ? serviceId : null,
      providerId: booking?.provider || providerId || null,
      bookingId: booking?._id || null,
      amount: parseFloat(amount),
      paymentMethod: 'cod',
      status: 'pending',
      transactionId: `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentNotes: notes || (serviceId ? `Service ID: ${serviceId}` : 'Direct booking')
    });

    res.json({
      bookingId: booking?._id,
      paymentId: payment.paymentId,
      amount: amount,
      status: 'confirmed',
      message: booking ? 'Booking confirmed! Pay cash on service.' : 'Payment initiated. Service will be provided.'
    });
  } catch (error) {
    console.error('Error creating COD:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark payment as paid (user confirms)
router.post('/mark-paid', protect, async (req, res) => {
  const { paymentId, bookingDate, bookingTime, address, customerDetails, notes } = req.body;

  // Validate required fields
  if (!paymentId) {
    return res.status(400).json({ message: 'Payment ID is required' });
  }

  try {
    const payment = await Payment.findOne({ $or: [{ _id: paymentId }, { payment_id: paymentId }], userId: req.user._id });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    if (payment.paymentMethod === 'upi' && payment.expiresAt && new Date() > payment.expiresAt) {
      payment.status = 'expired';
      await payment.save();
      return res.status(400).json({ message: 'UPI payment expired' });
    }

    payment.status = 'paid';
    await payment.save();

    // Step 1: Create booking if not exists (get provider from service)
    let booking = null;
    if (!payment.bookingId && payment.serviceId) {
      const service = await Service.findById(payment.serviceId);
      if (service && service.provider) {
        booking = await Booking.create({
          user: req.user._id,
          service: payment.serviceId,
          provider: service.provider,
          bookingDate: bookingDate || new Date().toISOString().split('T')[0],
          bookingTime: bookingTime || '10:00 AM',
          address: normalizeAddress(address),
          customerDetails: {
            name: customerDetails?.name || req.user.name || '',
            email: customerDetails?.email || req.user.email || '',
            phone: customerDetails?.phone || req.user.phone || ''
          },
          totalAmount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentStatus: 'paid',
          notes: notes || '',
          status: 'confirmed'
        });
        
        // Update payment with booking
        payment.bookingId = booking._id;
        payment.providerId = service.provider;
        await payment.save();
      }
    } else if (payment.bookingId) {
      booking = await Booking.findById(payment.bookingId);
    }

    // Step 2: Credit provider wallet (use providerId from payment or booking)
    const providerId = payment.providerId || booking?.provider;
    if (providerId) {
      await creditProviderWallet(providerId, payment.amount, payment.bookingId || booking?._id);
    }

    res.json({
      message: 'Payment marked as paid. Booking confirmed.',
      paymentId: payment.paymentId,
      bookingId: payment.bookingId,
      status: payment.status
    });
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get payment by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      $or: [{ _id: req.params.id }, { payment_id: req.params.id }], 
      userId: req.user._id 
    })
      .populate('serviceId')
      .populate('providerId');
  
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all payments
router.get('/admin/all', adminProtect, async (req, res) => {
  try {
    const { status, method } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.paymentMethod = method;

    const payments = await Payment.find(filter)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'title price')
      .populate('providerId', 'businessName')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Verify payment
router.put('/admin/verify/:id', adminProtect, async (req, res) => {
  const { status, notes } = req.body;

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status === 'approve' ? 'verified' : 'failed';
    payment.verifiedAt = new Date();
    payment.verifiedBy = req.user._id;
    if (notes) payment.paymentNotes = notes;
    await payment.save();

    // Update booking status
    if (payment.bookingId) {
      await Booking.findByIdAndUpdate(payment.bookingId, {
        paymentStatus: payment.status === 'verified' ? 'paid' : 'failed',
        status: payment.status === 'verified' ? 'confirmed' : 'cancelled'
      });
    }

    res.json({
      message: payment.status === 'verified' ? 'Payment verified successfully' : 'Payment rejected',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Legacy: Create order (for Razorpay integration)
router.post('/create-order', protect, async (req, res) => {
  const { amount, bookingId } = req.body;

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    res.json({
      id: orderId,
      amount: parseFloat(amount),
      currency: 'INR',
      bookingId: bookingId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Legacy: Verify payment (for Razorpay integration)
router.post('/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const payment = await Payment.create({
      userId: req.user._id,
      amount: 0,
      paymentMethod: 'razorpay',
      status: 'paid',
      transactionId: razorpay_payment_id,
      paymentNotes: `Order: ${razorpay_order_id}`
    });

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
