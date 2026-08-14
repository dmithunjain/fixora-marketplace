const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Provider = require('./models/Provider');
const ProviderService = require('./models/ProviderService');
const Wallet = require('./models/Wallet');

dotenv.config();

async function seedSampleData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: 'provider' });
    await Provider.deleteMany({});
    await ProviderService.deleteMany({});
    await Wallet.deleteMany({});

    // Create sample provider user
    const providerUser = await User.create({
      name: 'Rajesh Kumar',
      email: 'provider@fixora.com',
      phone: '9876543211', // Changed to avoid duplicate
      password: 'provider123', // Will be hashed by pre-save hook
      role: 'provider'
    });

    console.log('Provider user created');

    // Create provider profile
    const provider = await Provider.create({
      userId: providerUser._id,
      businessName: 'Rajesh Home Services',
      serviceCategory: 'Home Services',
      description: 'Professional home services provider with 5 years experience',
      experience: 5,
      hourlyRate: 450,
      phone: '9876543211', // Match user phone
      address: {
        state: 'Maharashtra',
        district: 'Mumbai',
        address: '123, ABC Society, Linking Road',
        pincode: '400050',
        city: 'Mumbai',
        area: 'Bandra West'
      },
      aadharNumber: '123456789012',
      isApproved: true,
      kycStatus: 'verified',
      verificationStatus: 'approved',
      isAvailable: true
    });

    console.log('Provider profile created');

    // Create wallet for provider
    const wallet = await Wallet.create({
      provider: provider._id,
      balance: 2500,
      pendingBalance: 500,
      totalEarnings: 3000
    });

    console.log('Provider wallet created');

     // Create sample services for the provider
     const servicesData = [
       {
         provider: provider._id,
         title: 'Full Home Cleaning',
         description: 'Professional deep cleaning for your entire home including kitchen, bathrooms and furniture surfaces.',
         category: 'cleaning',
         subCategory: 'deep cleaning',
         price: 449,
         duration: "3 hrs",
         slug: 'full-home-cleaning',
         location: {
           state: 'Maharashtra',
           city: 'Mumbai',
           area: 'Bandra West',
           fullAddress: '123, ABC Society, Linking Road, Bandra West, Mumbai - 400050'
         },
         serviceType: 'home',
         images: [
           'https://example.com/home-cleaning1.jpg',
           'https://example.com/home-cleaning2.jpg'
         ],
         availability: [
           { day: 'Monday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Tuesday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Wednesday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Thursday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Friday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Saturday', from: '08:00', to: '14:00', isAvailable: true },
           { day: 'Sunday', from: '10:00', to: '16:00', isAvailable: true }
         ],
         status: 'approved',
         adminPlacement: {
           showInHome: true,
           featured: true,
           priority: 1,
           category: 'cleaning',
           location: 'Mumbai'
         }
       },
       {
         provider: provider._id,
         title: 'AC Service & Repair',
         description: 'Complete AC cleaning and gas pressure check to ensure optimal cooling and longer appliance life.',
         category: 'appliance',
         subCategory: 'air conditioning',
         price: 898,
         duration: "45 mins",
         slug: 'ac-service-repair',
         location: {
           state: 'Maharashtra',
           city: 'Mumbai',
           area: 'Bandra West',
           fullAddress: '123, ABC Society, Linking Road, Bandra West, Mumbai - 400050'
         },
         serviceType: 'home',
         images: [
           'https://example.com/ac-service1.jpg',
           'https://example.com/ac-service2.jpg'
         ],
         availability: [
           { day: 'Monday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Tuesday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Wednesday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Thursday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Friday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Saturday', from: '08:00', to: '20:00', isAvailable: true },
           { day: 'Sunday', from: '10:00', to: '16:00', isAvailable: true }
         ],
         status: 'approved',
         adminPlacement: {
           showInHome: true,
           featured: false,
           priority: 2,
           category: 'appliance',
           location: 'Mumbai'
         }
       },
       {
         provider: provider._id,
         title: 'Haircut for Men',
         description: 'Professional men\'s haircut with expert styling and finishing.',
         category: 'salon',
         subCategory: 'haircut',
         price: 259,
         duration: "30 mins",
         slug: 'haircut-men',
         location: {
           state: 'Maharashtra',
           city: 'Mumbai',
           area: 'Bandra West',
           fullAddress: '123, ABC Society, Linking Road, Bandra West, Mumbai - 400050'
         },
         serviceType: 'home',
         images: [
           'https://example.com/haircut1.jpg',
           'https://example.com/haircut2.jpg'
         ],
         availability: [
           { day: 'Monday', from: '10:00', to: '20:00', isAvailable: true },
           { day: 'Tuesday', from: '10:00', to: '20:00', isAvailable: true },
           { day: 'Wednesday', from: '10:00', to: '20:00', isAvailable: true },
           { day: 'Thursday', from: '10:00', to: '20:00', isAvailable: true },
           { day: 'Friday', from: '10:00', to: '20:00', isAvailable: true },
           { day: 'Saturday', from: '10:00', to: '20:00', isAvailable: true },
           { day: 'Sunday', from: '10:00', to: '16:00', isAvailable: true }
         ],
         status: 'approved',
         adminPlacement: {
           showInHome: true,
           featured: true,
           priority: 3,
           category: 'salon',
           location: 'Mumbai'
         }
       }
     ];

    const createdServices = await ProviderService.insertMany(servicesData);
    console.log(`${createdServices.length} sample services created`);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedSampleData();