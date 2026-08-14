// Payment Transactions Data
import { users } from './users';

const paymentMethods = ['UPI', 'Card', 'Net Banking', 'Cash', 'Wallet'];
const services = [
  "Plumbing", "Electrician", "Cleaning", "AC Repair", "Carpenter",
  "Painting", "Pest Control", "Home Appliance Repair", "Locksmith", "Welding"
];

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

// Generate transactions
export const transactions = [];

for (let i = 1; i <= 200; i++) {
  const user = users[Math.floor(Math.random() * users.length)];
  const transactionDate = getRandomDate(2025, 2026);
  const amount = Math.floor(Math.random() * 3000) + 500;

  transactions.push({
    transactionId: `TXN${String(i).padStart(6, '0')}`,
    userName: user.name,
    userId: user.id,
    serviceName: getRandomElement(services),
    amount: amount,
    paymentMethod: getRandomElement(paymentMethods),
    date: transactionDate,
    time: getRandomTime(),
    invoiceNumber: `INV${String(i).padStart(6, '0')}`,
    status: 'Success',
    description: `Payment for service completion`,
    gst: Math.round(amount * 0.18),
    totalAmount: Math.round(amount * 1.18),
    reference: `REF${String(Math.random() * 1000000).padStart(6, '0')}`
  });
}

export default transactions;
