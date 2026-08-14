// Work Proof Upload Data
import bookings from './bookings';
import { providers } from './providers';

const getRandomDate = (startYear = 2025, endYear = 2026) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Generate work proofs for completed bookings
export const workProofs = bookings
  .filter(b => b.bookingStatus === 'Completed')
  .map((booking, index) => ({
    id: `WP${String(index + 1).padStart(5, '0')}`,
    bookingId: booking.bookingId,
    providerName: booking.providerName,
    providerId: booking.providerId,
    serviceName: booking.serviceName,
    // Use random placeholder images (picsum) so work proofs show realistic photos
    workImage: `https://picsum.photos/seed/${encodeURIComponent(booking.bookingId)}-full/800/600`,
    imageThumbnail: `https://picsum.photos/seed/${encodeURIComponent(booking.bookingId)}-thumb/400/250`,
    completionDate: booking.completionDate,
    uploadDate: getRandomDate(2025, 2026),
    verificationStatus: (() => {
      const rand = Math.random();
      if (rand < 0.70) return 'Verified';
      if (rand < 0.90) return 'Pending';
      return 'Rejected';
    })(),
    verifiedBy: Math.random() > 0.3 ? 'Admin User' : null,
    verifiedDate: Math.random() > 0.3 ? getRandomDate(2025, 2026) : null,
    rejectionReason: Math.random() > 0.85 ? 'Work quality not satisfactory' : null,
    amountEarned: booking.paymentAmount,
    bookingAmount: booking.paymentAmount,
    gstAmount: Math.round(booking.paymentAmount * 0.18),
    netAmount: Math.round(booking.paymentAmount * 0.82),
    description: `Work proof for ${booking.serviceName} service at customer location`,
    serviceDate: booking.bookingDate,
    serviceTime: booking.bookingTime
  }));

export default workProofs;
