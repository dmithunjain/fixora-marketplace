// Mapper function to convert backend service to frontend format
export function mapService(service) {
  if (!service) return null;
  
  return {
    id: service._id || service.id,
    _id: service._id || service.id,
    name: service.title || service.name || '',
    title: service.title || service.name || '',
    description: service.description || '',
    price: service.price || 0,
    oldPrice: service.originalPrice || 0,
    originalPrice: service.originalPrice || 0,
    discount: service.discount || 0,
    rating: service.rating || 4.5,
    reviews: service.totalRatings ? String(service.totalRatings) : "0",
    totalRatings: service.totalRatings || 0,
    totalReviews: service.totalReviews || 0,
    bookingsCount: service.bookingsCount || 0,
    duration: service.duration || '',
    availability: service.availability || service.availableDays || "All Days",
    availableDays: service.availableDays || extractDays(service.availability) || "Mon-Sat",
    timing: service.timing || extractTiming(service.availability) || "9 AM - 6 PM",
    category: service.categoryId || service.category || '',
    categoryId: service.categoryId || service.category || '',
    experience: service.highlights || service.experience || [],
    highlights: service.highlights || ["Trained Professionals", "Quality Guaranteed", "Post-Service Cleanup", "Instant Booking"],
    image: (service.images && service.images.length > 0) ? service.images[0] : service.image || getDefaultImage(service.category),
    images: (service.images && service.images.length > 0) ? service.images : (service.image ? [service.image] : [getDefaultImage(service.category)]),
    provider: service.provider,
    slug: service.slug
  };
}

// Helper to extract days from availability string
function extractDays(availability) {
  if (!availability) return null;
  if (availability.includes('Mon') || availability.includes('Sun')) {
    return availability;
  }
  return null;
}

// Helper to extract timing from availability string
function extractTiming(availability) {
  if (!availability) return null;
  // Check if it looks like a time range
  if (availability.includes('AM') || availability.includes('PM') || availability.includes(':')) {
    return availability;
  }
  return null;
}

// Get default image based on category
function getDefaultImage(category) {
  const defaultImages = {
    cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695b97835?w=400',
    'ac-repair': 'https://images.unsplash.com/photo-1631545806609-48cae9ff7d6d?w=400',
    electrical: 'https://images.unsplash.com/photo-1621905252507-b35492ac74e1?w=400',
    plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
    'salon-spa': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    'appliance-repair': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    'pest-control': 'https://images.unsplash.com/photo-1584559582126-bf2f716a201d?w=400',
    furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
    gardening: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
  };
  
  return defaultImages[category] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400';
}

// Default service for fallback
export const defaultService = {
  id: 0,
  name: 'Service',
  title: 'Service',
  description: 'Professional service at your doorstep',
  price: 0,
  oldPrice: 0,
  rating: 4.5,
  reviews: "0",
  duration: '',
  availableDays: "Mon-Sat",
  timing: "9 AM - 6 PM",
  category: '',
  experience: [],
  image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400']
};

export default mapService;
