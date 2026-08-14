const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const Provider = require('../models/Provider');
const { protect } = require('../middleware/auth');

// Get notifications for user or provider
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    
    // Build filter based on user type
    let filter = {};
    
    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        filter = { 
          $or: [
            { recipient: provider._id, recipientModel: 'Provider' },
            { user: req.user._id }
          ]
        };
      } else {
        filter = { user: req.user._id };
      }
    } else {
      filter = { user: req.user._id };
    }
    
    if (unread === 'true') {
      filter.isRead = false;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalCount = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });
    
    res.json({
      notifications,
      unreadCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/read-all', protect, async (req, res) => {
  try {
    let filter = { isRead: false };
    
    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        filter = {
          $or: [
            { recipient: provider._id, recipientModel: 'Provider' },
            { user: req.user._id }
          ],
          isRead: false
        };
      } else {
        filter.user = req.user._id;
      }
    } else {
      filter.user = req.user._id;
    }
    
    await Notification.updateMany(filter, { isRead: true });
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    let notification;
    
    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        notification = await Notification.findOneAndDelete({
          _id: req.params.id,
          $or: [
            { recipient: provider._id, recipientModel: 'Provider' },
            { user: req.user._id }
          ]
        });
      } else {
        notification = await Notification.findOneAndDelete({
          _id: req.params.id,
          user: req.user._id
        });
      }
    } else {
      notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });
    }
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', protect, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
