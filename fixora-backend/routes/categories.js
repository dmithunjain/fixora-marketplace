const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { adminProtect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', adminProtect, async (req, res) => {
  const { name, slug, description, image, icon } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  try {
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = await Category.create({ name, slug, description, image, icon });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', adminProtect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
