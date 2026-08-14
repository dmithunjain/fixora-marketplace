const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  targetPageId: { type: String, required: true },
  targetPath: { type: String, default: '' },
  categoryId: { type: String, default: '' },
  subCategoryId: { type: String, default: '' },
  sectionKey: { type: String, default: 'main' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

placementSchema.index({ serviceId: 1, targetPageId: 1 }, { unique: true });
placementSchema.index({ targetPageId: 1, displayOrder: 1 });

module.exports = mongoose.model('ServicePlacement', placementSchema);
