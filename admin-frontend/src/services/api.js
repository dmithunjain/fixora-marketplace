// Mock in-memory API using existing data files
// Provides providerAPI, paymentAPI, workproofAPI, userAPI, bookingAPI, revenueAPI

import usersData from '../data/users';
import providersData from '../data/providers';
import bookingsData from '../data/bookings';
import workProofs from '../data/workProofs';
import providerPaymentsDefault, { paymentStats as providerPaymentStats } from '../data/providerPayments';

// Clone data so we can mutate locally
const users = [...usersData];
const providers = providersData.map(p => ({ ...p }));
const bookings = bookingsData.map(b => ({ ...b }));
const workproofs = workProofs.map(w => ({ ...w }));

// paymentRecords and pendingPayments come from providerPayments.js
const paymentRecords = (providerPaymentsDefault.paymentRecords || []).map(p => ({ ...p }));
let pendingPayments = (providerPaymentsDefault.pendingPayments || []).map(p => ({ ...p }));
let rejectedWorkProofs = (providerPaymentsDefault.rejectedWorkProofs || []).map(p => ({ ...p }));
let providerPaymentSummary = (providerPaymentsDefault.providerPaymentSummary || []).map(p => ({ ...p }));
let paymentStats = { ...providerPaymentStats };

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to compute provider pending amount
const computeProviderPending = (providerId) => {
  const pending = pendingPayments.filter(p => p.providerId === providerId);
  const amount = pending.reduce((s, p) => s + (p.amount || 0), 0);
  return { count: pending.length, amount };
};

// Exported mock APIs
export const userAPI = {
  getAll: async () => {
    await delay();
    return users;
  },
  getById: async (id) => {
    await delay();
    return users.find(u => u.id === id) || null;
  }
};

export const bookingAPI = {
  getAll: async (filters = {}) => {
    await delay();
    // basic filtering by providerId or userId
    let result = bookings;
    if (filters.providerId) result = result.filter(b => b.providerId === filters.providerId);
    if (filters.userId) result = result.filter(b => b.userId === filters.userId);
    return result;
  }
};

export const workproofAPI = {
  getAll: async (filters = {}) => {
    await delay();
    let result = workproofs;
    if (filters.providerId) result = result.filter(w => w.providerId === filters.providerId);
    if (filters.status) result = result.filter(w => w.verificationStatus === filters.status);
    return result;
  },
  getById: async (id) => {
    await delay();
    return workproofs.find(w => w.id === id) || null;
  },
  verify: async (id, verifiedBy = 'Admin') => {
    await delay();
    const wp = workproofs.find(w => w.id === id);
    if (!wp) throw new Error('Work proof not found');
    wp.verificationStatus = 'Verified';
    wp.verifiedBy = verifiedBy;
    wp.verifiedDate = new Date().toISOString().split('T')[0];

    // Move from pendingPayments to paymentRecords if exists
    const pendingIndex = pendingPayments.findIndex(p => p.workProofId === id);
    if (pendingIndex !== -1) {
      const pending = pendingPayments.splice(pendingIndex, 1)[0];
      const newPay = {
        paymentId: `PAY${String(paymentRecords.length + 1).padStart(6, '0')}`,
        workProofId: pending.workProofId,
        bookingId: pending.bookingId,
        providerId: pending.providerId,
        providerName: pending.providerName,
        serviceName: pending.serviceName,
        amount: pending.amount,
        paymentMethod: 'UPI',
        transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentTime: new Date().toLocaleTimeString(),
        paymentStatus: 'Paid',
        initiatedBy: verifiedBy
      };
      paymentRecords.push(newPay);
      // update stats
      paymentStats.totalPaymentsMade = paymentRecords.filter(p => p.paymentStatus === 'Paid').length;
      paymentStats.totalPaymentAmount = paymentRecords.filter(p => p.paymentStatus === 'Paid').reduce((s,p) => s+p.amount, 0);
    }

    return wp;
  },
  reject: async (id, reason = '') => {
    await delay();
    const wp = workproofs.find(w => w.id === id);
    if (!wp) throw new Error('Work proof not found');
    wp.verificationStatus = 'Rejected';
    wp.rejectionReason = reason;
    rejectedWorkProofs.push(wp);
    return wp;
  }
};

export const providerAPI = {
  getAll: async () => {
    await delay();
    // attach pendingPayments count/amount
    return providers.map(p => {
      const { count, amount } = computeProviderPending(p.id);
      return {
        ...p,
        pendingPayments: amount,
        pendingPaymentCount: count
      };
    });
  },
  getById: async (id) => {
    await delay();
    const p = providers.find(x => x.id === id) || null;
    if (!p) return null;
    const { count, amount } = computeProviderPending(p.id);
    return { ...p, pendingPayments: amount, pendingPaymentCount: count };
  },
  getWorkProofs: async (providerId) => {
    await delay();
    return workproofs.filter(w => w.providerId === providerId);
  },
  getPaymentHistory: async (providerId) => {
    await delay();
    return paymentRecords.filter(pr => pr.providerId === providerId);
  },
  getStats: async () => {
    await delay();
    // aggregate basic stats
    return {
      totalProviders: providers.length,
      totalPendingPayments: pendingPayments.length,
      totalPendingAmount: pendingPayments.reduce((s,p) => s + (p.amount||0), 0),
      totalEarnings: providerPaymentSummary.reduce((s,p) => s + (p.totalEarnings||0), 0)
    };
  }
};

export const paymentAPI = {
  getPending: async () => {
    await delay();
    return pendingPayments;
  },
  getHistory: async () => {
    await delay();
    return paymentRecords;
  },
  getStats: async () => {
    await delay();
    return paymentStats;
  },
  processUPI: async (paymentId, upiId) => {
    await delay();
    const pay = paymentRecords.find(p => p.paymentId === paymentId) || pendingPayments.find(p => p.paymentId === paymentId);
    if (!pay) throw new Error('Payment not found');
    pay.paymentStatus = 'Paid';
    pay.upiId = upiId;
    pay.paymentDate = new Date().toISOString().split('T')[0];
    return pay;
  },
  confirmPayment: async (paymentId) => {
    await delay();
    const idx = pendingPayments.findIndex(p => p.paymentId === paymentId);
    if (idx === -1) throw new Error('Pending payment not found');
    const p = pendingPayments.splice(idx,1)[0];
    const newRecord = {
      ...p,
      paymentId: `PAY${String(paymentRecords.length + 1).padStart(6,'0')}`,
      paymentStatus: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0]
    };
    paymentRecords.push(newRecord);
    // update stats
    paymentStats.totalPaymentsMade = paymentRecords.filter(p => p.paymentStatus === 'Paid').length;
    paymentStats.totalPaymentAmount = paymentRecords.filter(p => p.paymentStatus === 'Paid').reduce((s,p) => s + (p.amount||0), 0);
    return newRecord;
  },
  createPendingPaymentForWorkProof: async (workProof) => {
    await delay();
    const newPending = {
      paymentId: `PAY-PENDING-${String(pendingPayments.length + 1).padStart(6, '0')}`,
      workProofId: workProof.id,
      bookingId: workProof.bookingId,
      providerId: workProof.providerId,
      providerName: workProof.providerName,
      serviceName: workProof.serviceName,
      amount: workProof.netAmount || 0,
      paymentStatus: 'Pending',
      verifiedDate: workProof.verifiedDate || new Date().toISOString().split('T')[0]
    };
    pendingPayments.push(newPending);
    return newPending;
  }
};

export const revenueAPI = {
  getMonthlyRevenue: async () => {
    await delay();
    // simple aggregate from bookings
    const months = {};
    bookings.forEach(b => {
      const m = (new Date(b.bookingDate)).toISOString().slice(0,7);
      months[m] = (months[m] || 0) + (b.paymentAmount || 0);
    });
    return months;
  }
};

export default {
  userAPI,
  bookingAPI,
  workproofAPI,
  providerAPI,
  paymentAPI,
  revenueAPI
};
