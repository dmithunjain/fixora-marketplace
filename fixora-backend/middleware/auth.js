const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      let user = await User.findById(decoded.id).select('-password');
      if (!user) {
        user = await Admin.findById(decoded.id);
      }
      req.user = user;
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

const provider = (req, res, next) => {
  if (req.user && (req.user.role === 'provider' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as provider' });
  }
};

const providerApproved = async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  
  if (req.user.role === 'provider') {
    const Provider = require('../models/Provider');
    const provider = await Provider.findOne({ userId: req.user._id });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    
    if (!provider.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin to approve your registration.' });
    }
    
    if (provider.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
    }
    
    req.provider = provider;
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized' });
  }
};

const adminProtect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Admin.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ message: 'Admin not found' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect, admin, provider, adminProtect, providerApproved };
