const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const ProviderService = require('../models/ProviderService');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { protect } = require('../middleware/auth');

const updateServiceRating = async (serviceId) => {
  const stats = await Review.aggregate([
    { $match: { service: serviceId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (stats.length > 0) {
    await ProviderService.findByIdAndUpdate(serviceId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count
    });
  }
};

const updateProviderRating = async (providerId) => {
  if (!providerId) return;
  
  const stats = await Review.aggregate([
    { $match: { provider: providerId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (stats.length > 0) {
    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count
    });
  }
};

router.post('/', protect, async (req, res) => {
  const { serviceId, providerId, bookingId, rating, title, comment, images } = req.body;
  
  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Valid service ID is required' });
    }

    const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
    
    const existingReview = await Review.findOne({ user: req.user._id, service: serviceObjectId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    const completedBooking = await Booking.findOne({
      user: req.user._id,
      service: serviceObjectId,
      status: 'completed'
    });

    const review = await Review.create({
      user: req.user._id,
      service: serviceObjectId,
      provider: providerId,
      booking: bookingId || completedBooking?._id,
      rating,
      title,
      comment,
      images: images || [],
      isVerified: !!completedBooking
    });

    await updateServiceRating(serviceId);

    if (providerId) {
      await updateProviderRating(providerId);
    }

    await review.populate('user', 'name');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/service/:serviceId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
    
    if (!req.params.serviceId || !mongoose.Types.ObjectId.isValid(req.params.serviceId)) {
      return res.status(400).json({ message: 'Valid service ID is required' });
    }
    
    const serviceObjectId = new mongoose.Types.ObjectId(req.params.serviceId);
    
    const reviews = await Review.find({ service: serviceObjectId })
      .populate('user', 'name')
      .populate('provider', 'businessName')
      .sort({ [sort]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const stats = await Review.aggregate([
      { $match: { service: serviceObjectId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const ratingDistribution = await Review.aggregate([
      { $match: { service: serviceObjectId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      reviews,
      totalReviews: stats[0]?.count || 0,
      averageRating: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      ratingDistribution: ratingDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      currentPage: page,
      totalPages: Math.ceil((stats[0]?.count || 0) / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('service', 'title images')
      .populate('provider', 'businessName')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const serviceId = review.service;
    const providerId = review.provider;
    await Review.findByIdAndDelete(req.params.id);
    await updateServiceRating(serviceId);
    if (providerId) {
      await updateProviderRating(providerId);
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/provider/:providerId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate('user', 'name')
      .populate('service', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const stats = await Review.aggregate([
      { $match: { provider: req.params.providerId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    res.json({
      reviews,
      averageRating: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      totalReviews: stats[0]?.count || 0,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
