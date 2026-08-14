// Dashboard Mock Data for FIXORA Admin Panel

// Dashboard Statistics
export const dashboardStats = {
  totalUsers: 1250,
  serviceProviders: 328,
  totalBookings: 2847,
  pendingApprovals: 24,
  blockedUsers: 12,
  totalRevenue: 8750000,
  monthlyGrowth: 18.5
};

// Indian Male and Female Names for Random User Generation
const indianMaleNames = [
  "Rahul", "Amit", "Rajesh", "Deepak", "Arun", "Vikas", "Sanjay", "Vikram",
  "Arjun", "Nikhil", "Ashok", "Mangal", "Rohan", "Karan", "Rohit", "Siddharth",
  "Akshay", "Varun", "Harish", "Suresh", "Naveen", "Gaurav", "Pradeep", "Sahil",
  "Ravi", "Sandeep", "Anand", "Ajay", "Mahesh", "Tarun", "Vaibhav", "Vivek",
  "Aditya", "Sameer", "Sanjeev", "Hemant", "Piyush", "Kunal", "Anuj", "Bhavesh",
  "Chetan", "Dinesh", "Eshwar", "Farhan", "Gaurav", "Harsh", "Inder", "Jamal",
  "Krishan", "Lokesh", "Mayank", "Namit", "Omkar", "Prakash"
];

const indianFemaleNames = [
  "Priya", "Anjali", "Deepika", "Neha", "Pooja", "Shruti", "Kavya", "Aisha",
  "Divya", "Isha", "Sonali", "Ritu", "Sneha", "Nikita", "Anu", "Geeta",
  "Meera", "Seema", "Sunita", "Tanvi", "Uma", "Vidya", "Wyoma", "Yamini",
  "Amrita", "Bhavna", "Chitra", "Disha", "Eba", "Falguni", "Gita", "Hema",
  "Ila", "Jyoti", "Kamla", "Lalita", "Madhuri", "Nalini", "Olivia", "Poonam",
  "Quleen", "Rani", "Sharma", "Tejaswini", "Uma", "Varsha", "Wanda", "Xenia",
  "Yasmin", "Zainab"
];

const lastNames = [
  "Sharma", "Patel", "Singh", "Gupta", "Verma", "Kumar", "Rao", "Nair",
  "Reddy", "Mishra", "Chopra", "Bhat", "Iyer", "Menon", "Kapoor", "Malik",
  "Khan", "Ahmed", "Hassan", "Desai", "Jain", "Agarwal", "Bhatnagar", "Sinha"
];

const services = [
  "Plumbing",
  "Electrician",
  "Cleaning",
  "AC Repair",
  "Carpenter",
  "Painting",
  "Pest Control",
  "Home Appliance Repair",
  "HVAC Service",
  "Locksmith",
  "Roof Repair",
  "Gardening",
  "Water Purification",
  "Welding",
  "Glass Work"
];

// Generate Random Name
const getRandomName = (gender) => {
  const firstName = gender === "female"
    ? indianFemaleNames[Math.floor(Math.random() * indianFemaleNames.length)]
    : indianMaleNames[Math.floor(Math.random() * indianMaleNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Generate Random Phone Number (Indian format)
const getRandomPhoneNumber = () => {
  const prefix = ['98', '97', '96', '95', '94'];
  const selectedPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const remainingDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return selectedPrefix + remainingDigits;
};

// Generate Random Email
const getRandomEmail = (name) => {
  const nameParts = name.toLowerCase().split(' ');
  const baseEmail = nameParts.join('.');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'email.com', 'fixora.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 9999);
  return randomNum > 0 ? `${baseEmail}${randomNum}@${domain}` : `${baseEmail}@${domain}`;
};

// Generate 50+ Random Users
export const users = [];

for (let i = 0; i < 60; i++) {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const name = getRandomName(gender);
  const isProvider = Math.random() > 0.75; // 25% are service providers

  users.push({
    id: `USR${String(i + 1).padStart(4, '0')}`,
    name: name,
    email: getRandomEmail(name),
    phone: getRandomPhoneNumber(),
    role: isProvider ? 'service_provider' : 'user',
    status: (() => {
      const rand = Math.random();
      if (rand < 0.85) return 'active';
      if (rand < 0.95) return 'blocked';
      return 'pending';
    })(),
    joinDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    bookingsCount: Math.floor(Math.random() * 50),
    ratings: (Math.random() * 5).toFixed(1)
  });
}

// Generate Booking Records
export const bookings = [];

for (let i = 0; i < 100; i++) {
  const userIndex = Math.floor(Math.random() * users.length);
  const providerIndex = Math.floor(Math.random() * users.length);
  const user = users[userIndex];
  const provider = users[providerIndex];
  const service = services[Math.floor(Math.random() * services.length)];

  const bookingDate = new Date(2026, 0, Math.floor(Math.random() * 65) + 1);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  bookings.push({
    bookingId: `BK${String(i + 1).padStart(5, '0')}`,
    userName: user.name,
    userId: user.id,
    providerName: provider.name,
    providerId: provider.id,
    serviceName: service,
    bookingDate: bookingDate.toISOString().split('T')[0],
    bookingTime: `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`,
    paymentAmount: Math.floor(Math.random() * 3000) + 500,
    paymentStatus: Math.random() > 0.15 ? 'Paid' : 'Pending',
    bookingStatus: (() => {
      const rand = Math.random();
      if (rand < 0.6) return 'Completed';
      if (rand < 0.8) return 'In Progress';
      if (rand < 0.95) return 'Scheduled';
      return 'Cancelled';
    })(),
    rating: Math.random() > 0.3 ? (Math.random() * 5).toFixed(1) : null
  });
}

// Generate Revenue Transactions
export const revenueTransactions = [];

const paymentMethods = ['UPI', 'Card', 'NetBanking', 'Cash', 'Wallet'];

for (let i = 0; i < 150; i++) {
  const transactionDate = new Date(2026, 0, Math.floor(Math.random() * 65) + 1);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const userIndex = Math.floor(Math.random() * users.length);
  const user = users[userIndex];

  revenueTransactions.push({
    transactionId: `TXN${String(i + 1).padStart(6, '0')}`,
    userName: user.name,
    userId: user.id,
    serviceName: services[Math.floor(Math.random() * services.length)],
    amountPaid: Math.floor(Math.random() * 3000) + 500,
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    date: transactionDate.toISOString().split('T')[0],
    time: `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`,
    status: 'Success'
  });
}

// Monthly Revenue Data for 2026
export const monthlyRevenue = [
  { month: 'Jan', revenue: 450000, bookings: 125 },
  { month: 'Feb', revenue: 520000, bookings: 142 },
  { month: 'Mar', revenue: 615000, bookings: 168 },
  { month: 'Apr', revenue: 680000, bookings: 185 },
  { month: 'May', revenue: 725000, bookings: 201 },
  { month: 'Jun', revenue: 810000, bookings: 228 },
  { month: 'Jul', revenue: 875000, bookings: 245 },
  { month: 'Aug', revenue: 920000, bookings: 265 },
  { month: 'Sep', revenue: 980000, bookings: 285 },
  { month: 'Oct', revenue: 1050000, bookings: 310 },
  { month: 'Nov', revenue: 1120000, bookings: 328 },
  { month: 'Dec', revenue: 1180000, bookings: 350 }
];

// Service-wise Bookings Data for Chart
export const serviceBookings = [
  { service: 'Electrician', bookings: 385, revenue: 920000 },
  { service: 'Plumbing', bookings: 328, revenue: 650000 },
  { service: 'Cleaning', bookings: 285, revenue: 450000 },
  { service: 'AC Repair', bookings: 245, revenue: 735000 },
  { service: 'Carpenter', bookings: 215, revenue: 645000 },
  { service: 'Painting', bookings: 180, revenue: 480000 },
  { service: 'Pest Control', bookings: 165, revenue: 330000 },
  { service: 'Home Appliance Repair', bookings: 142, revenue: 426000 },
  { service: 'HVAC Service', bookings: 135, revenue: 540000 },
  { service: 'Locksmith', bookings: 125, revenue: 375000 }
];

// Payment Method Distribution
export const paymentMethodData = [
  { method: 'UPI', amount: 2850000, percentage: 32.5 },
  { method: 'Card', amount: 2562500, percentage: 29.3 },
  { method: 'NetBanking', amount: 1750000, percentage: 20.0 },
  { method: 'Cash', amount: 875000, percentage: 10.0 },
  { method: 'Wallet', amount: 712500, percentage: 8.2 }
];

// Top Service Providers
export const topServiceProviders = users
  .filter(user => user.role === 'service_provider')
  .sort((a, b) => b.bookingsCount - a.bookingsCount)
  .slice(0, 10)
  .map((provider, index) => ({
    rank: index + 1,
    name: provider.name,
    bookings: provider.bookingsCount,
    rating: provider.ratings,
    revenue: Math.floor(Math.random() * 500000) + 100000,
    status: provider.status
  }));

// Recent Activities
export const recentActivities = [
  {
    id: 'ACT001',
    type: 'booking',
    message: 'New booking created',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    icon: 'calendar'
  },
  {
    id: 'ACT002',
    type: 'user',
    message: 'New user registered',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    icon: 'user-plus'
  },
  {
    id: 'ACT003',
    type: 'provider',
    message: 'New service provider joined',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    icon: 'briefcase'
  },
  {
    id: 'ACT004',
    type: 'payment',
    message: 'Payment received',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    icon: 'credit-card'
  },
  {
    id: 'ACT005',
    type: 'review',
    message: 'New review posted',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    icon: 'star'
  }
];

// User Growth Data (Monthly)
export const userGrowthData = [
  { month: 'Jan', users: 450, providers: 85 },
  { month: 'Feb', users: 580, providers: 105 },
  { month: 'Mar', users: 720, providers: 128 },
  { month: 'Apr', users: 890, providers: 152 },
  { month: 'May', users: 1050, providers: 175 },
  { month: 'Jun', users: 1220, providers: 205 },
  { month: 'Jul', users: 1420, providers: 240 },
  { month: 'Aug', users: 1620, providers: 270 },
  { month: 'Sep', users: 1850, providers: 295 },
  { month: 'Oct', users: 2100, providers: 320 },
  { month: 'Nov', users: 2320, providers: 345 },
  { month: 'Dec', users: 2500, providers: 365 }
];

// Chart Data Configuration for Recharts/Chart.js
export const chartConfigs = {
  monthlyRevenue: {
    type: 'line',
    title: 'Monthly Revenue',
    dataKey: 'revenue',
    xAxisKey: 'month',
    color: '#8884d8'
  },
  serviceBookings: {
    type: 'bar',
    title: 'Service-wise Bookings',
    dataKey: 'bookings',
    xAxisKey: 'service',
    color: '#82ca9d'
  },
  userGrowth: {
    type: 'area',
    title: 'User Growth',
    dataSets: [
      { name: 'Users', dataKey: 'users', color: '#ffc658' },
      { name: 'Providers', dataKey: 'providers', color: '#ff7c7c' }
    ],
    xAxisKey: 'month'
  },
  paymentMethods: {
    type: 'pie',
    title: 'Payment Method Distribution',
    dataKey: 'amount',
    nameKey: 'method'
  }
};

// Export all data as a single object for convenience
export const mockData = {
  dashboardStats,
  users,
  bookings,
  revenueTransactions,
  monthlyRevenue,
  serviceBookings,
  paymentMethodData,
  topServiceProviders,
  recentActivities,
  userGrowthData,
  chartConfigs
};
