import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  // Check for provider token FIRST
  const providerAuth = localStorage.getItem('providerAuth');
  if (providerAuth) {
    try {
      const token = JSON.parse(providerAuth).token;
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
        return req;
      }
    } catch (e) {
      console.error('Error parsing providerAuth:', e);
    }
  }
  
  // Check for user token
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const token = JSON.parse(userInfo).token;
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
        return req;
      }
    } catch (e) {
      console.error('Error parsing userInfo:', e);
    }
  }
  
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  updatePassword: (data) => API.put('/auth/password', data)
};

export const userAPI = {
  getProfile: () => API.get('/users/me'),
  updateProfile: (data) => API.put('/users/me', data)
};

export const serviceAPI = {
  getAll: (params) => API.get('/provider-services/public', { params }),
  getById: (id) => API.get(`/provider-services/${id}`),
  getByCategory: (category) => API.get(`/provider-services/public?category=${category}`),
  getBySlug: (slug) => API.get(`/provider-services/slug/${slug}`)
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getBySlug: (slug) => API.get(`/categories/${slug}`)
};

export const bookingAPI = {
  create: (data) => API.post('/bookings/create', data),
  getUserBookings: () => API.get('/bookings'),
  getBookingById: (id) => API.get(`/bookings/${id}`),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status }),
  assignProvider: (id, providerId) => API.put(`/bookings/${id}/assign`, { providerId }),
  updatePayment: (id, paymentStatus, paymentMethod) => API.put(`/bookings/${id}/payment`, { paymentStatus, paymentMethod }),
  uploadWorkProof: (id, image, description) => API.put(`/bookings/${id}/work-proof`, { image, description }),
  cancelBooking: (id) => API.delete(`/bookings/${id}`)
};

export const providerAPI = {
  register: (data) => API.post('/providers/register', data),
  login: (data) => API.post('/providers/login', data),
  getProfile: () => API.get('/providers/profile'),
  updateProfile: (data) => API.put('/providers/profile', data),
  getAll: (params) => API.get('/providers', { params }),
  getById: (id) => API.get(`/providers/${id}`),
  getStats: () => API.get('/providers/stats'),
  getJobs: (params) => API.get('/providers/jobs', { params }),
  updateJobStatus: (id, status) => API.put(`/providers/jobs/${id}/status`, { status }),
  uploadWorkProof: (id, image, description) => API.put(`/providers/jobs/${id}/work-proof`, { image, description }),
  updateBankDetails: (data) => API.put('/providers/profile/bank-details', data),
  updatePanDetails: (data) => API.put('/providers/profile/pan-details', data),
  updateUpiDetails: (data) => API.put('/providers/profile/upi-details', data)
};

export const adminAPI = {
  login: (data) => API.post('/admin/login', data),
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  getProviders: () => API.get('/admin/providers'),
  verifyProvider: (id, status) => API.put(`/admin/provider/${id}/verify`, { status }),
  verifyBank: (id, status, rejectionReason) => API.put(`/admin/provider/${id}/verify-bank`, { id, status, rejectionReason }),
  verifyPan: (id) => API.put(`/providers/admin/verify-pan/${id}`, {}),
  verifyUpi: (id) => API.put(`/providers/admin/verify-upi/${id}`, {}),
  rejectKyc: (id, type, reason) => API.put(`/providers/admin/reject-kyc/${id}`, { type, reason }),
  getBookings: (status) => API.get('/admin/bookings', { params: { status } }),
  updateBookingStatus: (id, status) => API.put(`/admin/booking/${id}/status`, { status }),
  getServices: () => API.get('/admin/services'),
  getCategories: () => API.get('/admin/categories'),
  createCategory: (data) => API.post('/admin/categories', data),
  updateCategory: (id, data) => API.put(`/admin/categories/${id}`, data),
  blockUser: (id) => API.put(`/admin/user/${id}/block`)
};

export const reviewAPI = {
  createReview: (data) => API.post('/reviews', data),
  getServiceReviews: (serviceId, params) => API.get(`/reviews/service/${serviceId}`, { params }),
  getUserReviews: () => API.get('/reviews/user'),
  getProviderReviews: (providerId, params) => API.get(`/reviews/provider/${providerId}`, { params }),
  markHelpful: (reviewId) => API.put(`/reviews/${reviewId}/helpful`),
  deleteReview: (reviewId) => API.delete(`/reviews/${reviewId}`)
};

export const paymentAPI = {
  createOrder: (amount, bookingId) => API.post('/payments/create-order', { amount, bookingId }),
  verifyPayment: (data) => API.post('/payments/verify', data),
  getPaymentByBookingId: (bookingId) => API.get(`/payments/${bookingId}`),
  createUPI: (data) => API.post('/payments/create-upi', data),
  createCard: (data) => API.post('/payments/create-card', data),
  createCOD: (data) => API.post('/payments/create-cod', data),
  markPaid: (paymentId, data) => API.post('/payments/mark-paid', { paymentId, ...data }),
  getById: (id) => API.get(`/payments/${id}`)
};

export const providerServiceAPI = {
  getMyServices: () => API.get('/services/provider'),
  getService: (id) => API.get(`/services/${id}`),
  createService: (data) => API.post('/services/create', data),
  updateService: (id, data) => API.put(`/services/${id}`, data),
  deleteService: (id) => API.delete(`/services/${id}`)
};

export const publicServiceAPI = {
  getServices: (params) => API.get('/services', { params }),
  getServiceById: (id) => API.get(`/services/${id}`),
  getServicesByPage: (pageId, params) => API.get(`/services/page/${pageId}`, { params }),
  getPlacementOverrides: (params) => API.get('/services/placements', { params }),
  getCategories: () => API.get('/categories'),
  searchServices: (query) => API.get('/services/search', { params: { q: query } })
};

export const walletAPI = {
  getWallet: () => API.get('/wallet'),
  addPending: (amount, bookingId) => API.post('/wallet/add-pending', { amount, bookingId }),
  releaseFunds: (amount, bookingId) => API.post('/wallet/release-funds', { amount, bookingId }),
  requestWithdrawal: (data) => API.post('/wallet/withdraw', data),
  getWithdrawals: () => API.get('/wallet/withdrawals'),
  getWithdrawalSlip: (id) => API.get(`/wallet/withdrawal-slip/${id}`)
};

export const supportAPI = {
  getTickets: () => API.get('/support'),
  createTicket: (data) => API.post('/support', data),
  getTicketById: (id) => API.get(`/support/${id}`),
  respondToTicket: (id, message) => API.post(`/support/${id}/respond`, { message }),
  updateTicketStatus: (id, status) => API.put(`/support/${id}/status`, { status })
};

export const notificationAPI = {
  getNotifications: (params) => API.get('/notifications', { params }),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  deleteNotification: (id) => API.delete(`/notifications/${id}`)
};

export default API;
