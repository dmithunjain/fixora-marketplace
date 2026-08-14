const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const adminExists = await Admin.findOne({ email: 'admin@fixora.com' });
    
    if (adminExists) {
      console.log('Admin already exists');
    } else {
      await Admin.create({
        name: 'Admin',
        email: 'admin@fixora.com',
        password: 'admin123'
      });
      console.log('Admin created: admin@fixora.com / admin123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();