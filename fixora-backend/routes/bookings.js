const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, adminProtect } = require('../middleware/auth');
const { createNotification } = require('../utils/notificationUtils');

router.post('/create', protect, async (req, res) => {
    const { serviceId, bookingDate, bookingTime, address, customerDetails, notes, totalAmount } = req.body;
    
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const normalizedAddress = {
        state: address?.state || '',
        district: address?.district || '',
        city: address?.city || '',
        address: address?.address || '',
        pincode: address?.pincode || ''
      };
      
      const booking = await Booking.create({
        user: req.user._id,
        service: serviceId,
        provider: service.provider || null,
        bookingDate,
        bookingTime,
        address: normalizedAddress,
        customerDetails: {
          name: customerDetails?.name || req.user.name || '',
          email: customerDetails?.email || req.user.email || '',
          phone: customerDetails?.phone || req.user.phone || ''
        },
        totalAmount: Number(totalAmount) || service.price,
        notes
      });
      
      await booking.populate('service');
      
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service')
      .populate('provider')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', adminProtect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    
    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('service')
      .populate('provider')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Booking.countDocuments(filter);
    
    res.json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service')
      .populate('provider');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('service user provider');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/assign', protect, async (req, res) => {
  const { providerId } = req.body;
  
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { provider: providerId, status: 'assigned' },
      { new: true }
    ).populate('service user provider');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Create notification for user
    await createNotification(
      booking.user._id,
      'Service Request Assigned',
      `Your booking for ${booking.service.title} has been assigned to ${booking.provider?.businessName || 'a provider'}.`,
      'booking'
    );
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/payment', protect, async (req, res) => {
  const { paymentStatus, paymentMethod } = req.body;
  
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentMethod },
      { new: true }
    ).populate('service user provider');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/work-proof', protect, async (req, res) => {
  const { image, description } = req.body;
  
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        workProof: { image, description, uploadedAt: Date.now() },
        status: 'completed'
      },
      { new: true }
    ).populate('service user provider');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Create notification for user about service completion
    await createNotification(
      booking.user._id,
      'Service Completed',
      `Your booking for ${booking.service.title} has been marked as completed by ${booking.provider?.businessName || 'the provider'}.`,
      'booking'
    );
    
    // If payment is pending, we might want to trigger payment notification separately
    // but for now, we'll just notify about completion
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
