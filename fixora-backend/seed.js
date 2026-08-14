const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Service = require('./models/Service');

dotenv.config();

const categories = [
  { name: 'Salon & Spa', slug: 'salon-spa', description: 'Hair styling, facials, spa treatments', icon: 'content_cut', order: 1 },
  { name: 'Electrical', slug: 'electrical', description: 'Wiring, repairs, installations', icon: 'electrical_services', order: 2 },
  { name: 'Plumbing', slug: 'plumbing', description: 'Pipe fitting, leak repairs, drainage', icon: 'plumbing', order: 3 },
  { name: 'Cleaning', slug: 'cleaning', description: 'Home cleaning, deep cleaning', icon: 'cleaning_services', order: 4 },
  { name: 'Appliance Repair', slug: 'appliance-repair', description: 'AC, fridge, washing machine repair', icon: 'kitchen', order: 5 },
  { name: 'Pest Control', slug: 'pest-control', description: 'Pest extermination services', icon: 'bug_report', order: 6 },
  { name: 'Beauty & Grooming', slug: 'beauty-grooming', description: 'Makeup, threading, grooming', icon: 'face', order: 7 },
  { name: 'Furniture', slug: 'furniture', description: 'Assembly, repair, painting', icon: 'chair', order: 8 }
];

const services = [
  { name: 'Haircut for Men', slug: 'haircut-men', description: 'Professional haircut and styling', category: 'salon-spa', price: 300, duration: 30 },
  { name: 'Haircut for Women', slug: 'haircut-women', description: 'Professional haircut and styling', category: 'salon-spa', price: 500, duration: 45 },
  { name: 'Hair Spa Treatment', slug: 'hair-spa', description: 'Relaxing hair spa treatment', category: 'salon-spa', price: 800, duration: 60 },
  { name: 'Facial Cleanup', slug: 'facial-cleanup', description: 'Classic facial with cleanup', category: 'beauty-grooming', price: 600, duration: 45 },
  { name: 'Beard Styling', slug: 'beard-styling', description: 'Beard trim and styling', category: 'salon-spa', price: 200, duration: 20 },
  { name: 'Full Home Cleaning', slug: 'full-home-cleaning', description: 'Complete home deep cleaning', category: 'cleaning', price: 2500, duration: 240 },
  { name: 'Kitchen Cleaning', slug: 'kitchen-cleaning', description: 'Deep kitchen cleaning', category: 'cleaning', price: 1200, duration: 120 },
  { name: 'Bathroom Cleaning', slug: 'bathroom-cleaning', description: 'Professional bathroom cleaning', category: 'cleaning', price: 800, duration: 90 },
  { name: 'AC Repair', slug: 'ac-repair', description: 'Air conditioner repair service', category: 'appliance-repair', price: 500, duration: 60 },
  { name: 'AC Gas Refill', slug: 'ac-gas-refill', description: 'AC gas refill and servicing', category: 'appliance-repair', price: 1500, duration: 90 },
  { name: 'Electrician Visit', slug: 'electrician-visit', description: 'Electrical repair and installation', category: 'electrical', price: 300, duration: 45 },
  { name: 'Fan Installation', slug: 'fan-installation', description: 'Ceiling fan installation', category: 'electrical', price: 400, duration: 60 },
  { name: 'Plumber Visit', slug: 'plumber-visit', description: 'Plumbing repair service', category: 'plumbing', price: 300, duration: 45 },
  { name: 'Pest Control Treatment', slug: 'pest-control', description: 'Full pest control treatment', category: 'pest-control', price: 2000, duration: 180 },
  { name: 'Furniture Assembly', slug: 'furniture-assembly', description: 'Furniture assembly service', category: 'furniture', price: 500, duration: 60 },
  { name: 'Bridal Makeup', slug: 'bridal-makeup', description: 'Professional bridal makeup', category: 'beauty-grooming', price: 5000, duration: 120 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Category.deleteMany({});
    await Service.deleteMany({});
    
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');
    
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    const servicesWithCategory = services.map(service => ({
      ...service,
      category: categoryMap[service.category]
    }));
    
    await Service.insertMany(servicesWithCategory);
    console.log('Services seeded');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
