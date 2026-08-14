const express = require('express');
const router = express.Router();
const ProviderService = require('../models/ProviderService');
const Service = require('../models/Service');
const { adminProtect } = require('../middleware/auth');

// Get all pending services
router.get('/pending-services', adminProtect, async (req, res) => {
  try {
    const services = await ProviderService.find({ status: 'pending' })
      .populate('provider')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all services
router.get('/all-services', adminProtect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const services = await ProviderService.find(filter)
      .populate('provider')
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve service
router.post('/approve-service/:id', adminProtect, async (req, res) => {
  try {
    const service = await ProviderService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.status !== 'pending') {
      return res.status(400).json({ message: 'Service already processed' });
    }

    service.status = 'approved';
    await service.save();

    // Also add to main Services collection
    await Service.create({
      name: service.title,
      slug: service.title.toLowerCase().replace(/\s+/g, '-'),
      description: service.description,
      category: service.category,
      price: service.price,
      provider: service.provider,
      image: service.images[0] || '',
      isAvailable: true
    });

    res.json({ message: 'Service approved', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject service
router.post('/reject-service/:id', adminProtect, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const service = await ProviderService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.status !== 'pending') {
      return res.status(400).json({ message: 'Service already processed' });
    }

    service.status = 'rejected';
    service.rejectionReason = reason;
    await service.save();

    res.json({ message: 'Service rejected', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get public approved services (for users)
router.get('/public/services', async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice } = req.query;
    
    const filter = { status: 'approved', isActive: true };
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const services = await ProviderService.find(filter)
      .populate('provider', 'businessName rating')
      .sort({ createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
