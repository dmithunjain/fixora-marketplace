import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (adminInfo) {
    const token = JSON.parse(adminInfo).token;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export const authAPI = {
  login: async (data) => {
    try {
      const response = await API.post('/admin/login', data);
      const userData = response.data;
      if (userData.role === 'admin') {
        localStorage.setItem('adminInfo', JSON.stringify(userData));
      }
      return userData;
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('adminInfo');
  },
  getMe: () => API.get('/admin/me')
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  getProviders: () => API.get('/admin/providers'),
  
  // Provider Verification (Account Verification)
  verifyProvider: (id, status, reason) => {
    console.log('Verifying provider:', id, 'with status:', status);
    return API.put(`/admin/provider/${id}/verify`, { status, reason });
  },
  
  // Provider Block/Unblock with Reason
  blockProvider: (id, isBlocked, reason) => {
    console.log('Blocking provider:', id, 'isBlocked:', isBlocked);
    return API.put(`/admin/provider/${id}/block`, { isBlocked, reason });
  },
  
  // Delete Provider (only blocked providers)
  deleteProvider: (id) => API.delete(`/admin/provider/${id}`),
  
  getBookings: (status) => API.get('/admin/bookings', { params: { status } }),
  updateBookingStatus: (id, status) => API.put(`/admin/booking/${id}/status`, { status }),
  getServices: () => API.get('/admin/services'),
  getCategories: () => API.get('/admin/categories'),
  createCategory: (data) => API.post('/admin/categories', data),
  updateCategory: (id, data) => API.put(`/admin/categories/${id}`, data),
  blockUser: (id) => API.put(`/admin/user/${id}/block`),
  
  // Service Approval
  getPendingServices: () => API.get('/admin/services/pending'),
  getAllServices: (status) => API.get('/admin/services', { params: { status } }),
  approveService: (id) => API.put(`/admin/services/${id}/approve`),
  rejectService: (id, reason) => API.put(`/admin/services/${id}/reject`, { adminNotes: reason }),
  removeService: (id) => API.delete(`/admin/services/${id}`),
  editService: (id, data) => API.put(`/admin/services/${id}`, data),

  // Public APIs
  getPublicServices: (params) => API.get('/services', { params }),
  getServiceById: (id) => API.get(`/services/${id}`),
  getPublicCategories: () => API.get('/categories'),
  
  // Withdrawals
  getWithdrawals: (status) => API.get('/wallet/admin/withdrawals', { params: { status } }),
  approveWithdrawal: (id, providerId) => API.post('/wallet/admin/withdraw/approve', { withdrawalId: id, providerId }),
  rejectWithdrawal: (id, providerId, reason) => API.post('/wallet/admin/withdraw/reject', { withdrawalId: id, providerId, reason }),
  
  // Company Earnings
  getCompanyEarnings: (params) => API.get('/wallet/admin/company-earnings', { params }),
  getCompanyEarningsSummary: () => API.get('/wallet/admin/company-earnings/summary'),
  
  // KYC Verification
  getBankPendingProviders: () => API.get('/admin/providers/bank-pending'),
  verifyBank: (id, status, rejectionReason) => {
    if (status === 'verified') {
      return API.put(`/providers/admin/verify-bank/${id}`);
    }
    return API.put(`/providers/admin/reject-kyc/${id}`, { type: 'bank', reason: rejectionReason });
  },
  verifyPan: (id, status) => API.put(`/providers/admin/verify-pan/${id}`, { status }),
  verifyUpi: (id, status) => API.put(`/providers/admin/verify-upi/${id}`, { status }),
  rejectKyc: (id, type, reason) => API.put(`/providers/admin/reject-kyc/${id}`, { type, reason }),

  // Support Tickets
  getSupportTickets: (params) => API.get('/support/admin/all', { params }),
  getSupportTicketById: (id) => API.get(`/support/${id}`),
  respondToTicket: (id, message) => API.post(`/support/${id}/respond`, { message }),
  updateTicketStatus: (id, status) => API.put(`/support/${id}/status`, { status }),
  getSupportStats: () => API.get('/support/admin/stats'),

  // Password Reset Requests
  getPasswordResetRequests: (status) => API.get('/admin/password-reset-requests', { params: { status } }),
  approvePasswordReset: (id) => API.put(`/admin/password-reset-requests/${id}/approve`),
  rejectPasswordReset: (id, reason) => API.put(`/admin/password-reset-requests/${id}/reject`, { reason }),

  // Service Placements
  getServicePlacements: (params) => API.get('/admin/service-placement', { params }),
  getServicePlacementsByPage: (pageId) => API.get(`/admin/service-placement/page/${pageId}`),
  createServicePlacement: (data) => API.post('/admin/service-placement', data),
  updateServicePlacement: (id, data) => API.put(`/admin/service-placement/${id}`, data),
  deleteServicePlacement: (id) => API.delete(`/admin/service-placement/${id}`)
};

export const serviceAPI = {
  getAll: (params) => API.get('/services', { params }),
  getByCategory: (category) => API.get(`/services/category/${category}`)
};

export const categoryAPI = {
  getAll: () => API.get('/categories')
};

export default API;
