const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ProviderService = require('../models/ProviderService');
const Provider = require('../models/Provider');
const Wallet = require('../models/Wallet');
const { protect, providerApproved } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get provider's services (protected but doesn't require approval)
router.get('/my-services', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const services = await ProviderService.find({ provider: provider._id })
      .sort({ createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all approved services (public - for users)
router.get('/public', async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, search } = req.query;
    const filter = { status: 'approved', isActive: true };
    
    if (category) filter.category = category;
    if (city) filter['location.city'] = city;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await ProviderService.find(filter)
      .populate('provider', 'businessName rating totalReviews')
      .sort({ 'adminPlacement.priority': -1, createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await ProviderService.findOne({ slug: req.params.slug })
      .populate('provider', 'businessName rating totalReviews');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await ProviderService.findById(req.params.id)
      .populate('provider', 'businessName rating totalReviews description');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new service (requires provider approval)
router.post('/', protect, [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('category').notEmpty(),
  body('price').isNumeric(),
  body('location').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // Check if provider is approved
    if (!provider.isApproved) {
      return res.status(403).json({ message: 'Your account must be approved before adding services' });
    }

    const { title, description, category, subCategory, price, location, serviceType, images, availability } = req.body;

    const service = await ProviderService.create({
      provider: provider._id,
      title,
      description,
      category,
      subCategory: subCategory || '',
      price,
      location,
      serviceType: serviceType || 'both',
      images: images || [],
      availability: availability || [],
      status: 'pending'
    });

    // Create wallet if doesn't exist
    let wallet = await Wallet.findOne({ provider: provider._id });
    if (!wallet) {
      wallet = await Wallet.create({ provider: provider._id });
    }

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service with image upload
router.post('/with-images', protect, upload.array('images', 5), async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    if (!provider.isApproved) {
      return res.status(403).json({ message: 'Your account must be approved before adding services' });
    }

    const imageUrls = req.files.map(file => file.path);
    const { title, description, category, subCategory, price, location, serviceType, availability } = req.body;

    const service = await ProviderService.create({
      provider: provider._id,
      title,
      description,
      category,
      subCategory: subCategory || '',
      price,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      serviceType: serviceType || 'both',
      images: imageUrls,
      availability: availability ? JSON.parse(availability) : [],
      status: 'pending'
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service
router.put('/:id', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const service = await ProviderService.findOne({ 
      _id: req.params.id, 
      provider: provider._id 
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Can only update if not approved
    if (service.status === 'approved') {
      return res.status(400).json({ message: 'Cannot update approved service' });
    }

    const { title, description, category, price, location, serviceType, images } = req.body;

    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;
    service.price = price || service.price;
    service.location = location || service.location;
    service.serviceType = serviceType || service.serviceType;
    if (images) service.images = images;
    service.status = 'pending'; // Reset to pending after edit

    await service.save();

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete service
router.delete('/:id', protect, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const service = await ProviderService.findOneAndDelete({ 
      _id: req.params.id, 
      provider: provider._id 
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
