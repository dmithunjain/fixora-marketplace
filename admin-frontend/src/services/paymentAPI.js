const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Work Proof API
export const workproofAPI = {
  uploadWorkProof: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/workproof/upload`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  getAllWorkProofs: async (status = null, providerId = null) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (providerId) params.append("providerId", providerId);

    const response = await fetch(`${API_BASE_URL}/workproof?${params}`);
    return response.json();
  },

  getWorkProofById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/workproof/${id}`);
    return response.json();
  },

  verifyWorkProof: async (id, verifiedBy) => {
    const response = await fetch(`${API_BASE_URL}/workproof/${id}/verify`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy }),
    });
    return response.json();
  },

  rejectWorkProof: async (id, rejectionReason) => {
    const response = await fetch(`${API_BASE_URL}/workproof/${id}/reject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rejectionReason }),
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/workproof/stats/all`);
    return response.json();
  },
};

// Payment API
export const paymentAPI = {
  getPendingPayments: async () => {
    const response = await fetch(`${API_BASE_URL}/payment/pending`);
    return response.json();
  },

  getPaymentHistory: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.paymentMethod) params.append("paymentMethod", filters.paymentMethod);
    if (filters.providerId) params.append("providerId", filters.providerId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await fetch(`${API_BASE_URL}/payment/history?${params}`);
    return response.json();
  },

  getPaymentStats: async () => {
    const response = await fetch(`${API_BASE_URL}/payment/stats`);
    return response.json();
  },

  getMonthlyAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/payment/analytics/monthly`);
    return response.json();
  },

  processUPIPayment: async (paymentId, payerUPI) => {
    const response = await fetch(`${API_BASE_URL}/payment/${paymentId}/upi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payerUPI }),
    });
    return response.json();
  },

  confirmPayment: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payment/${paymentId}/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  processBankTransfer: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payment/${paymentId}/bank-transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
};

// Provider API
export const providerAPI = {
  getAllProviders: async () => {
    const response = await fetch(`${API_BASE_URL}/provider`);
    return response.json();
  },

  getProviderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/provider/${id}`);
    return response.json();
  },

  getProviderWorkProofs: async (providerId) => {
    const response = await fetch(`${API_BASE_URL}/provider/${providerId}/work-proofs`);
    return response.json();
  },

  getProviderPaymentHistory: async (providerId) => {
    const response = await fetch(`${API_BASE_URL}/provider/${providerId}/payments`);
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/provider/stats/all`);
    return response.json();
  },
};
