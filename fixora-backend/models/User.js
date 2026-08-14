const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: {
    state: String,
    district: String,
    address: String,
    pincode: String
  },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password.startsWith('$2')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
