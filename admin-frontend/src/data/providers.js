// Service Providers Data
import { users } from './users';

const serviceTypes = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Cleaner",
  "AC Repair",
  "Painter",
  "Pest Control",
  "Home Appliance Repair",
  "Locksmith",
  "Welder"
];

// Avatar style rotation for variety
const avatarStyles = ['avataaars', 'big-smile', 'pixel-art', 'adventurer', 'micah', 'notionists'];

// Filter service providers from users
export const providers = users
  .filter(user => user.role === 'service_provider')
  .map((provider, index) => ({
    id: provider.id,
    providerName: provider.name,
    email: provider.email,
    phone: provider.phone,
    city: provider.city,
    gender: provider.gender,
    serviceType: serviceTypes[index % serviceTypes.length],
    rating: (Math.random() * 5).toFixed(1),
    completedJobs: Math.floor(Math.random() * 150) + 5,
    earnings: Math.floor(Math.random() * 500000) + 50000,
    totalReviews: Math.floor(Math.random() * 200),
    responseTime: Math.floor(Math.random() * 120) + 5,
    status: provider.status,
    joinedDate: provider.joinedDate,
    documents: Math.random() > 0.3 ? 'verified' : 'pending',
    bankDetails: Math.random() > 0.2 ? 'added' : 'pending',
    // Professional avatar images - DiceBear API (free, no authentication needed)
    profileImage: `https://api.dicebear.com/7.x/${avatarStyles[index % avatarStyles.length]}/svg?seed=${provider.name.replace(/\s+/g, '')}&scale=80`
  }));

export default providers;
