const express = require('express');
const router = express.Router();
const ServiceHighlight = require('../models/ServiceHighlight');
const ProviderService = require('../models/ProviderService');
const { protect, adminProtect } = require('../middleware/auth');

// Get highlighted services (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    
    if (type) {
      filter.highlightType = type;
    }

    const highlights = await ServiceHighlight.find(filter)
      .populate({
        path: 'service',
        populate: {
          path: 'provider',
          select: 'businessName rating'
        }
      })
      .sort({ highlightType: 1, position: 1 });

    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all highlight types with services
router.get('/all', async (req, res) => {
  try {
    const highlightTypes = ['featured', 'most_booked', 'top_rated', 'new_arrival', 'seasonal_offer'];
    
    const result = {};
    
    for (const type of highlightTypes) {
      const highlights = await ServiceHighlight.find({ highlightType: type, isActive: true })
        .populate({
          path: 'service',
          populate: {
            path: 'provider',
            select: 'businessName rating'
          }
        })
        .sort({ position: 1 });
      
      result[type] = highlights;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Add service to highlight
router.post('/', adminProtect, async (req, res) => {
  try {
    const { serviceId, highlightType, position, startDate, endDate } = req.body;

    // Verify service exists
    const service = await ProviderService.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if already highlighted
    let highlight = await ServiceHighlight.findOne({ service: serviceId, highlightType });
    
    if (highlight) {
      highlight.position = position || highlight.position;
      highlight.isActive = true;
      highlight.startDate = startDate || highlight.startDate;
      highlight.endDate = endDate || highlight.endDate;
      highlight.addedBy = req.user._id;
    } else {
      highlight = await ServiceHighlight.create({
        service: serviceId,
        highlightType,
        position: position || 0,
        startDate,
        endDate,
        addedBy: req.user._id
      });
    }

    await highlight.save();
    
    const populatedHighlight = await ServiceHighlight.findById(highlight._id)
      .populate({
        path: 'service',
        populate: {
          path: 'provider',
          select: 'businessName rating'
        }
      });

    res.json(populatedHighlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Remove service from highlight
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const highlight = await ServiceHighlight.findByIdAndDelete(req.params.id);
    
    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }

    res.json({ message: 'Service removed from highlight' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update highlight (change type, position, etc.)
router.put('/:id', adminProtect, async (req, res) => {
  try {
    const { highlightType, position, isActive, startDate, endDate } = req.body;
    
    const updateData = {};
    if (highlightType) updateData.highlightType = highlightType;
    if (position !== undefined) updateData.position = position;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;

    const highlight = await ServiceHighlight.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate({
      path: 'service',
      populate: {
        path: 'provider',
        select: 'businessName rating'
      }
    });

    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }

    res.json(highlight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all highlights (including inactive)
router.get('/admin/all', adminProtect, async (req, res) => {
  try {
    const highlights = await ServiceHighlight.find()
      .populate({
        path: 'service',
        populate: {
          path: 'provider',
          select: 'businessName rating'
        }
      })
      .populate('addedBy', 'name')
      .sort({ highlightType: 1, position: 1 });

    res.json(highlights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-highlight: Mark most booked services
router.post('/auto/most-booked', adminProtect, async (req, res) => {
  try {
    const { limit = 10 } = req.body;

    // Get most booked services
    const mostBooked = await ProviderService.aggregate([
      { $match: { isApproved: true, isActive: true } },
      { $addFields: { bookingCount: { $size: { $ifNull: ['$bookings', []] } } } },
      { $sort: { bookingCount: -1 } },
      { $limit: limit }
    ]);

    // Clear existing most_booked highlights
    await ServiceHighlight.deleteMany({ highlightType: 'most_booked' });

    // Create new highlights
    const highlights = await Promise.all(
      mostBooked.map(async (service, index) => {
        return await ServiceHighlight.create({
          service: service._id,
          highlightType: 'most_booked',
          position: index,
          addedBy: req.user._id
        });
      })
    );

    res.json({ message: `${highlights.length} services highlighted as most booked`, highlights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-highlight: Mark top rated services
router.post('/auto/top-rated', adminProtect, async (req, res) => {
  try {
    const { limit = 10, minReviews = 5 } = req.body;

    // Get top rated services
    const topRated = await ProviderService.find({ isApproved: true, isActive: true })
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit);

    // Clear existing top_rated highlights
    await ServiceHighlight.deleteMany({ highlightType: 'top_rated' });

    // Create new highlights
    const highlights = await Promise.all(
      topRated.map(async (service, index) => {
        return await ServiceHighlight.create({
          service: service._id,
          highlightType: 'top_rated',
          position: index,
          addedBy: req.user._id
        });
      })
    );

    res.json({ message: `${highlights.length} services highlighted as top rated`, highlights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
