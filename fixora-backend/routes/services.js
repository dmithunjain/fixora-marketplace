const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const ServicePlacement = require('../models/ServicePlacement');
const { protect } = require('../middleware/auth');

// Search services
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const services = await Service.find({
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
    .populate('provider', 'businessName')
    .limit(10)
    .sort({ createdAt: -1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const filter = { isAvailable: true };
    
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const services = await Service.find(filter)
      .populate('provider')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Service.countDocuments(filter);
    
    res.json({
      services,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    let filter = { isAvailable: true };
    
    // Check if it's a valid ObjectId - if so, search by category ID
    // Otherwise, search by category name (stored as string in Service)
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      // It's a slug or name - search by category field (which stores either ID or name)
      filter.$or = [
        { category: category },
        { category: { $regex: new RegExp('^' + category + '$', 'i') } }
      ];
    }
    
    const services = await Service.find(filter).populate('provider');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: Get services by page ID (from placements)
router.get('/page/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { category, search } = req.query;

    // Find placements for this page
    const placements = await ServicePlacement.find({ targetPageId: pageId, isActive: true })
      .populate({
        path: 'serviceId',
        match: { isApproved: true }
      })
      .sort({ displayOrder: 1 });

    // Filter out null serviceIds and map to services
    let services = placements
      .filter((p) => p.serviceId)
      .map((p) => p.serviceId);

    // Apply category filter if provided
    if (category) {
      services = services.filter((s) => s.categoryId === category || s.category === category);
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      services = services.filter(
        (s) =>
          s.title?.toLowerCase().includes(searchLower) ||
          s.name?.toLowerCase().includes(searchLower) ||
          s.description?.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      services,
      total: services.length,
      pageId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: Get placement overrides (bulk)
router.get('/placements', async (req, res) => {
  try {
    const { ids, category } = req.query;
    const filter = { isActive: true };

    if (ids) {
      const pageIds = String(ids)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      if (pageIds.length > 0) {
        filter.targetPageId = { $in: pageIds };
      }
    }

    const placements = await ServicePlacement.find(filter)
      .populate({
        path: 'serviceId',
        match: { isApproved: true }
      })
      .sort({ targetPageId: 1, displayOrder: 1 });

    let normalized = placements
      .filter((p) => p.serviceId)
      .map((p) => ({
        _id: p._id,
        targetPageId: p.targetPageId,
        categoryId: p.categoryId || '',
        displayOrder: p.displayOrder || 0,
        service: p.serviceId
      }));

    if (category) {
      normalized = normalized.filter(
        (p) => p.categoryId === category || p.service?.categoryId === category || p.service?.category === category
      );
    }

    res.json({ placements: normalized, total: normalized.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider's own services
router.get('/provider', protect, async (req, res) => {
  try {
    const Provider = require('../models/Provider');
    const providerProfile = await Provider.findOne({ userId: req.user._id });

    const providerIds = [req.user._id];
    if (providerProfile?._id) {
      providerIds.push(providerProfile._id);
    }

    const services = await Service.find({
      $or: [
        { provider: { $in: providerIds } },
        { createdByUser: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug }).populate('provider');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let service = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      service = await Service.findById(req.params.id);
    }

    if (!service) {
      service = await Service.findOne({ slug: req.params.id });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    try {
      await service.populate('provider');
    } catch (populateError) {
      console.warn('Service populate warning:', populateError.message);
    }

    res.json(service);
  } catch (error) {
    console.error('Service details error:', error);
    res.status(500).json({ message: 'Failed to fetch service details' });
  }
});

router.post('/', protect, async (req, res) => {
  const { name, slug, description, category, subcategory, price, duration, image } = req.body;
  
  try {
    const Provider = require('../models/Provider');
    const providerProfile = await Provider.findOne({ userId: req.user._id });
    const providerRef = providerProfile?._id || req.user._id;

    const service = await Service.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      category,
      subcategory,
      price,
      duration,
      image,
      provider: providerRef
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Provider: Create service (for approval system)
router.post('/create', protect, async (req, res) => {
  try {
    const {
      title,
      name,
      description,
      price,
      originalPrice,
      discount,
      categoryId,
      category,
      subCategoryId,
      images,
      image,
      duration,
      availability,
      availableDays,
      timing,
      highlights,
      experience,
      availableDates,
      availableTimes
    } = req.body;

    // Validate required fields
    const normalizedTitle = (title || name || '').trim();
    if (!normalizedTitle) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }

    // Generate slug from title
    const slug = normalizedTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    // Find the Provider document linked to this user
    const Provider = require('../models/Provider');
    let providerRef = null;
    
    // If user is a provider, try to find their Provider profile
    if (req.user.role === 'provider') {
      const providerProfile = await Provider.findOne({ userId: req.user._id });
      if (providerProfile) {
        providerRef = providerProfile._id;
      }
      // Don't fall back to user._id - services without provider can't be booked
    }
    // Only allow service creation if we have a valid provider reference
    if (!providerRef && req.user.role !== 'provider') {
      providerRef = req.user._id; // Fallback for admin-created services
    }

    const normalizedImages = Array.isArray(images)
      ? images.filter(Boolean)
      : (images ? [images] : (image ? [image] : []));
    const normalizedHighlights = Array.isArray(highlights)
      ? highlights
      : (Array.isArray(experience) ? experience : []);
    const normalizedAvailability = availability || [availableDays, timing].filter(Boolean).join(', ');

    const serviceData = {
      title: normalizedTitle,
      name: normalizedTitle,
      slug: slug,
      description: description || '',
      price: parseFloat(price) || req.body.price,
      originalPrice: parseFloat(originalPrice) || parseFloat(price) || 0,
      discount: parseInt(discount) || 0,
      category: categoryId || category || req.body.category || '',
      categoryId: categoryId || category || req.body.category || '',
      subCategory: subCategoryId || req.body.subcategory || '',
      subCategoryId: subCategoryId || req.body.subcategory || '',
      createdByUser: req.user._id,
      provider: providerRef,
      image: normalizedImages[0] || '',
      images: normalizedImages,
      duration: duration || '',
      availability: normalizedAvailability || '',
      highlights: normalizedHighlights,
      availableDates: availableDates || [],
      availableTimes: availableTimes || [],
      isAvailable: false,
      isApproved: false,
      isPublished: false,
      status: 'pending'
    };
    
    const service = await Service.create(serviceData);
    
    res.status(201).json({ message: 'Your service is under review.', service });
  } catch (error) {
    console.error('Service creation error:', error);
    const tooLarge = /BSONObj size|document is larger than the maximum|object to insert too large/i.test(error.message || '');
    if (tooLarge) {
      return res.status(400).json({ message: 'Image is too large to save. Please use a smaller image.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const Provider = require('../models/Provider');
    const providerProfile = await Provider.findOne({ userId: req.user._id });
    const providerId = providerProfile?._id;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const serviceProviderId = String(service.provider || '');
    const createdById = String(service.createdByUser || '');
    const isOwner =
      serviceProviderId === String(req.user._id) ||
      (providerId && serviceProviderId === String(providerId)) ||
      createdById === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this service' });
    }

    const updates = {
      ...req.body,
      deleteRequested: false,
      deleteRequestedAt: undefined,
      deleteRequestedBy: undefined,
      adminNotes: req.body.adminNotes || service.adminNotes
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    Object.assign(service, updates);

    // Provider edits should apply directly without requiring approval again.
    if (service.isApproved) {
      service.status = 'approved';
      service.isAvailable = true;
      service.isPublished = true;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    const tooLarge = /BSONObj size|document is larger than the maximum|object to insert too large/i.test(error.message || '');
    if (tooLarge) {
      return res.status(400).json({ message: 'Image is too large to save. Please choose a lighter image.' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const Provider = require('../models/Provider');
    const providerProfile = await Provider.findOne({ userId: req.user._id });
    const providerId = providerProfile?._id;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const serviceProviderId = String(service.provider || '');
    const createdById = String(service.createdByUser || '');
    const isOwner =
      serviceProviderId === String(req.user._id) ||
      (providerId && serviceProviderId === String(providerId)) ||
      createdById === String(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to remove this service' });
    }

    // Provider removal goes to admin for final deletion.
    if (req.user.role !== 'admin') {
      service.deleteRequested = true;
      service.deleteRequestedAt = new Date();
      service.deleteRequestedBy = req.user._id;
      service.isAvailable = false;
      await service.save();
      return res.json({ message: 'Removal request sent to admin.' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
