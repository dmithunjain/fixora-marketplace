// Bookings Data
import { users } from './users';

const services = [
  "Plumbing",
  "Electrician",
  "Cleaning",
  "AC Repair",
  "Carpenter",
  "Painting",
  "Pest Control",
  "Home Appliance Repair",
  "Locksmith",
  "Welding"
];

const bookingStatuses = ['Completed', 'In Progress', 'Scheduled', 'Cancelled'];
const paymentStatuses = ['Paid', 'Pending', 'Failed'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (startYear = 2025, endYear = 2026) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

// Generate 150+ bookings
export const bookings = [];

for (let i = 1; i <= 150; i++) {
  const user = users[Math.floor(Math.random() * users.length)];
  const provider = users[Math.floor(Math.random() * users.length)];
  const serviceName = getRandomElement(services);

  bookings.push({
    bookingId: `BK${String(i).padStart(5, '0')}`,
    userName: user.name,
    userId: user.id,
    providerName: provider.name,
    providerId: provider.id,
    serviceName: serviceName,
    bookingDate: getRandomDate(2025, 2026),
    bookingTime: getRandomTime(),
    paymentAmount: Math.floor(Math.random() * 3000) + 500,
    paymentStatus: getRandomElement(paymentStatuses),
    bookingStatus: getRandomElement(bookingStatuses),
    rating: Math.random() > 0.3 ? (Math.random() * 5).toFixed(1) : null,
    review: Math.random() > 0.5 ? 'Great service!' : null,
    completionDate: getRandomDate(2025, 2026),
    invoiceNumber: `INV${String(i).padStart(6, '0')}`
  });
}

export default bookings;
