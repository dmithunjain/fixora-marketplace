const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const SupportTicket = require('../models/SupportTicket');
const Provider = require('../models/Provider');
const { protect, adminProtect } = require('../middleware/auth');

// User/Provider: Create a support ticket
router.post('/', protect, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { subject, description, category, priority, relatedBooking, attachments } = req.body;
    
    const ticketData = {
      subject,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      attachments: attachments || []
    };

    // Determine if user or provider
    if (req.user.role === 'provider') {
      // Get provider by userId
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        ticketData.provider = provider._id;
      }
    } else {
      ticketData.user = req.user._id;
    }

    if (relatedBooking) {
      ticketData.relatedBooking = relatedBooking;
    }

    const ticket = await SupportTicket.create(ticketData);
    
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User/Provider: Get their tickets
router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    
    if (req.user.role === 'provider') {
      // Get provider by userId
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        filter.provider = provider._id;
      } else {
        // No provider profile, return empty array
        return res.json([]);
      }
    } else if (req.user.role === 'user') {
      filter.user = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin sees all tickets
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.query;
    if (status) filter.status = status;

    const tickets = await SupportTicket.find(filter)
      .populate('user', 'name email phone')
      .populate('provider', 'businessName')
      .populate('relatedBooking')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single ticket details
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('provider', 'businessName')
      .populate('relatedBooking')
      .populate('responses.respondedBy', 'name role')
      .populate('assignedTo', 'name');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check access
    let isOwner = false;
    
    if (ticket.user) {
      isOwner = ticket.user._id?.toString() === req.user._id.toString();
    }
    
    if (!isOwner && ticket.provider) {
      // For provider, check if the provider's userId matches
      const provider = await Provider.findById(ticket.provider._id);
      if (provider && provider.userId.toString() === req.user._id.toString()) {
        isOwner = true;
      }
    }
    
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User/Provider: Add response to ticket
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const { message } = req.body;
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check access
    const isOwner = ticket.user?.toString() === req.user._id.toString() || 
                    ticket.provider?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.responses.push({
      message,
      respondedBy: req.user._id,
      isAdmin: req.user.role === 'admin'
    });

    // If admin responds, mark as in_progress
    if (req.user.role === 'admin' && ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();
    
    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('responses.respondedBy', 'name role');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update ticket status
router.put('/:id/status', adminProtect, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    
    const updateData = { status };
    
    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    if (status === 'resolved') {
      updateData.resolvedAt = Date.now();
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email phone')
     .populate('provider', 'businessName')
     .populate('assignedTo', 'name');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all tickets with filters
router.get('/admin/all', adminProtect, async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await SupportTicket.find(filter)
      .populate('user', 'name email phone')
      .populate('provider', 'businessName')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get ticket statistics
router.get('/admin/stats', adminProtect, async (req, res) => {
  try {
    const stats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      byStatus: stats,
      byPriority: priorityStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
