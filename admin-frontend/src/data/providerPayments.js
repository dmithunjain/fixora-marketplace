// Provider Payments Data
import workProofs from './workProofs';

const paymentMethods = ['UPI', 'Bank Transfer', 'Wallet'];

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

// Generate provider earnings summary
const providerEarnings = {};

workProofs.forEach(proof => {
  if (!providerEarnings[proof.providerId]) {
    providerEarnings[proof.providerId] = {
      providerId: proof.providerId,
      providerName: proof.providerName,
      serviceType: proof.serviceName,
      completedJobs: 0,
      pendingPayments: 0,
      totalEarnings: 0,
      verifiedEarnings: 0,
      pendingVerification: 0
    };
  }

  providerEarnings[proof.providerId].completedJobs += 1;

  if (proof.verificationStatus === 'Verified') {
    providerEarnings[proof.providerId].totalEarnings += proof.netAmount;
    providerEarnings[proof.providerId].verifiedEarnings += proof.netAmount;
  } else if (proof.verificationStatus === 'Pending') {
    providerEarnings[proof.providerId].pendingPayments += 1;
    providerEarnings[proof.providerId].pendingVerification += proof.netAmount;
  }
});

export const providerPaymentSummary = Object.values(providerEarnings);

// Generate payment records (for paid out providers)
export const paymentRecords = [];

let paymentIndex = 1;
workProofs.forEach(proof => {
  if (proof.verificationStatus === 'Verified' && Math.random() > 0.3) {
    const paymentDate = getRandomDate(2025, 2026);
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    paymentRecords.push({
      paymentId: `PAY${String(paymentIndex++).padStart(6, '0')}`,
      workProofId: proof.id,
      bookingId: proof.bookingId,
      providerId: proof.providerId,
      providerName: proof.providerName,
      serviceName: proof.serviceName,
      serviceType: proof.serviceName,
      amount: proof.netAmount,
      gstAmount: proof.gstAmount,
      grossAmount: proof.bookingAmount,
      paymentMethod: paymentMethod,
      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentDate: paymentDate,
      paymentTime: getRandomTime(),
      paymentStatus: Math.random() > 0.15 ? 'Paid' : 'Failed',
      bankAccountLast4: String(Math.random() * 10000).padStart(4, '0'),
      upiId: `${proof.providerName.toLowerCase().replace(/\s/g, '')}@upi`,
      referenceNumber: `REF${String(Math.random() * 1000000).padStart(7, '0')}`,
      remarks: 'Payment for completed service verification',
      initiatedBy: 'Admin System',
      initiatedDate: getRandomDate(2025, 2026)
    });
  }
});

// Pending payments (verified but not yet paid)
export const pendingPayments = workProofs
  .filter(proof => proof.verificationStatus === 'Verified')
  .filter((proof, idx) => !paymentRecords.some(p => p.workProofId === proof.id))
  .map((proof, index) => ({
    paymentId: `PAY-PENDING-${String(index + 1).padStart(6, '0')}`,
    workProofId: proof.id,
    bookingId: proof.bookingId,
    providerId: proof.providerId,
    providerName: proof.providerName,
    serviceName: proof.serviceName,
    serviceType: proof.serviceName,
    amount: proof.netAmount,
    gstAmount: proof.gstAmount,
    grossAmount: proof.bookingAmount,
    paymentStatus: 'Pending',
    verifiedDate: proof.verifiedDate,
    daysWaitingForPayment: Math.floor(Math.random() * 15) + 1,
    upiId: `${proof.providerName.toLowerCase().replace(/\s/g, '')}@upi`,
    bankAccountLast4: String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  }));

// Rejected work proofs (payment not eligible)
export const rejectedWorkProofs = workProofs.filter(p => p.verificationStatus === 'Rejected');

// Provider payment statistics
export const paymentStats = {
  totalPaymentsMade: paymentRecords.filter(p => p.paymentStatus === 'Paid').length,
  totalPaymentAmount: paymentRecords
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0),
  pendingPaymentCount: pendingPayments.length,
  pendingPaymentAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
  failedPayments: paymentRecords.filter(p => p.paymentStatus === 'Failed').length,
  averagePaymentAmount: Math.round(
    paymentRecords.filter(p => p.paymentStatus === 'Paid').length > 0
      ? paymentRecords
          .filter(p => p.paymentStatus === 'Paid')
          .reduce((sum, p) => sum + p.amount, 0) /
          paymentRecords.filter(p => p.paymentStatus === 'Paid').length
      : 0
  )
};

export default {
  paymentRecords,
  pendingPayments,
  rejectedWorkProofs,
  providerPaymentSummary,
  paymentStats
};
