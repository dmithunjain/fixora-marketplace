import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';
import './BankVerifications.css';

const BankVerifications = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchBankPendingProviders();
  }, []);

   const getToken = () => {
     try {
       return JSON.parse(localStorage.getItem('adminInfo') || '{}').token;
     } catch {
       return '';
     }
   };

   const fetchBankPendingProviders = async () => {
     try {
       setLoading(true);
       const response = await adminAPI.getBankPendingProviders();
       setProviders(Array.isArray(response.data) ? response.data : []);
     } catch (error) {
       console.error("Error fetching providers:", error);
       if (error.response?.status === 401 || error.response?.status === 403) {
         alert("Session expired or access denied. Please login as admin.");
         window.location.href = '/admin/login';
       }
       setProviders([]);
     } finally {
       setLoading(false);
     }
   };

   const handleVerify = async (providerId) => {
     setActionLoading(true);
     try {
       await adminAPI.verifyBank(providerId, 'verified', '');
       setShowVerifyModal(false);
       fetchBankPendingProviders();
       alert('Bank details verified successfully!');
     } catch (error) {
       console.error("Error verifying:", error);
       alert('Failed to verify bank details');
     } finally {
       setActionLoading(false);
     }
   };

   const handleReject = async () => {
     if (!rejectReason.trim()) {
       alert('Please provide a rejection reason');
       return;
     }
     
     setActionLoading(true);
     try {
       await adminAPI.verifyBank(selectedProvider._id, 'rejected', rejectReason);
       setShowRejectModal(false);
       setRejectReason("");
       fetchBankPendingProviders();
       alert('Bank details rejected successfully!');
     } catch (error) {
       console.error("Error rejecting:", error);
       alert('Failed to reject bank details');
     } finally {
       setActionLoading(false);
     }
   };

  const openVerifyModal = (provider) => {
    setSelectedProvider(provider);
    setShowVerifyModal(true);
  };

  const openRejectModal = (provider) => {
    setSelectedProvider(provider);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const maskedAccountNumber = (accNo) => {
    if (!accNo) return 'N/A';
    return accNo.slice(0, 4) + '****' + accNo.slice(-4);
  };

  const filteredProviders = providers.filter(p => {
    if (filter === 'all') return true;
    return p.bankDetails?.verificationStatus === filter;
  });

  const statusCounts = {
    pending: providers.filter(p => p.bankDetails?.verificationStatus === 'pending').length,
    verified: providers.filter(p => p.bankDetails?.verificationStatus === 'verified').length,
    rejected: providers.filter(p => p.bankDetails?.verificationStatus === 'rejected').length
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { class: 'badge-warning', label: 'Pending' },
      verified: { class: 'badge-success', label: 'Verified' },
      rejected: { class: 'badge-danger', label: 'Rejected' }
    };
    const config = configs[status] || configs.pending;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        
        <div className="page-content">
          <div className="bank-header">
            <div className="bank-header-left">
              <h1>Bank Verifications</h1>
              <p>Review and verify provider bank account details</p>
            </div>
            <div className="bank-stats">
              <div className="bank-stat pending">
                <span className="bank-stat-count">{statusCounts.pending}</span>
                <span className="bank-stat-label">Pending</span>
              </div>
              <div className="bank-stat verified">
                <span className="bank-stat-count">{statusCounts.verified}</span>
                <span className="bank-stat-label">Verified</span>
              </div>
              <div className="bank-stat rejected">
                <span className="bank-stat-count">{statusCounts.rejected}</span>
                <span className="bank-stat-label">Rejected</span>
              </div>
            </div>
          </div>

          <div className="bank-filters">
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({statusCounts.pending})
            </button>
            <button 
              className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
              onClick={() => setFilter('verified')}
            >
              Verified ({statusCounts.verified})
            </button>
            <button 
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({statusCounts.rejected})
            </button>
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
          </div>

          {loading ? (
            <div className="bank-loading"></div>
          ) : filteredProviders.length === 0 ? (
            <div className="bank-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
              </svg>
              <h3>No Bank Verifications</h3>
              <p>No bank verification requests found.</p>
            </div>
          ) : (
            <div className="bank-table-container">
              <table className="bank-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Bank Name</th>
                    <th>Account Number</th>
                    <th>IFSC Code</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.map(provider => (
                    <tr key={provider._id}>
                      <td>
                        <div className="provider-cell">
                          <div className="provider-avatar-small">
                            {(provider.businessName || provider.fullName || 'P').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="provider-name-cell">{provider.businessName || provider.fullName}</div>
                            <div className="provider-email">{provider.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{provider.bankDetails?.bankName || 'N/A'}</td>
                      <td>
                        <code className="account-number">{maskedAccountNumber(provider.bankDetails?.accountNumber)}</code>
                      </td>
                      <td>
                        <code className="ifsc-code">{provider.bankDetails?.ifscCode || 'N/A'}</code>
                      </td>
                      <td>{provider.bankDetails?.mobileNumber || 'N/A'}</td>
                      <td>{getStatusBadge(provider.bankDetails?.verificationStatus)}</td>
                      <td>
                        {provider.bankDetails?.verificationDate 
                          ? new Date(provider.bankDetails.verificationDate).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td>
                        {provider.bankDetails?.verificationStatus === 'pending' && (
                          <div className="action-buttons-inline">
                            <button 
                              className="btn-verify-inline"
                              onClick={() => openVerifyModal(provider)}
                            >
                              Verify
                            </button>
                            <button 
                              className="btn-reject-inline"
                              onClick={() => openRejectModal(provider)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {provider.bankDetails?.verificationStatus === 'verified' && (
                          <span className="verified-text">✓ Verified</span>
                        )}
                        {provider.bankDetails?.verificationStatus === 'rejected' && (
                          <span className="rejected-text">✗ Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && selectedProvider && (
        <div className="bank-modal-overlay" onClick={() => setShowVerifyModal(false)}>
          <div className="bank-modal verify-modal" onClick={e => e.stopPropagation()}>
            <div className="bank-modal-header">
              <h2>Verify Bank Details</h2>
              <button className="close-btn" onClick={() => setShowVerifyModal(false)}>×</button>
            </div>
            <div className="bank-modal-body">
              <div className="provider-info-section">
                <div className="provider-info-avatar">
                  {(selectedProvider.businessName || selectedProvider.fullName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="provider-info-name">{selectedProvider.businessName || selectedProvider.fullName}</div>
                  <div className="provider-info-email">{selectedProvider.email}</div>
                  <div className="provider-info-phone">{selectedProvider.phone}</div>
                </div>
              </div>

              <div className="bank-details-section">
                <h3>Bank Account Details</h3>
                <div className="bank-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Bank Name</span>
                    <span className="detail-value">{selectedProvider.bankDetails?.bankName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Number</span>
                    <span className="detail-value">
                      <code>{selectedProvider.bankDetails?.accountNumber || 'N/A'}</code>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">IFSC Code</span>
                    <span className="detail-value">
                      <code>{selectedProvider.bankDetails?.ifscCode || 'N/A'}</code>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Holder</span>
                    <span className="detail-value">{selectedProvider.bankDetails?.accountHolderName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mobile Number</span>
                    <span className="detail-value">{selectedProvider.bankDetails?.mobileNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="verify-warning">
                <p>Are you sure you want to verify this bank account? This action will allow the provider to receive payments.</p>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel-modal" onClick={() => setShowVerifyModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-confirm-verify"
                  onClick={() => handleVerify(selectedProvider._id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Verifying...' : 'Confirm Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProvider && (
        <div className="bank-modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="bank-modal reject-modal" onClick={e => e.stopPropagation()}>
            <div className="bank-modal-header reject-header">
              <h2>Reject Bank Details</h2>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}>×</button>
            </div>
            <div className="bank-modal-body">
              <div className="provider-info-section">
                <div className="provider-info-avatar reject-avatar">
                  {(selectedProvider.businessName || selectedProvider.fullName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="provider-info-name">{selectedProvider.businessName || selectedProvider.fullName}</div>
                  <div className="provider-info-email">{selectedProvider.email}</div>
                </div>
              </div>

              <div className="bank-details-section">
                <h3>Bank Account Details</h3>
                <div className="bank-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Bank Name</span>
                    <span className="detail-value">{selectedProvider.bankDetails?.bankName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Number</span>
                    <span className="detail-value">
                      <code>{maskedAccountNumber(selectedProvider.bankDetails?.accountNumber)}</code>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">IFSC Code</span>
                    <span className="detail-value">
                      <code>{selectedProvider.bankDetails?.ifscCode || 'N/A'}</code>
                    </span>
                  </div>
                </div>
              </div>

              <div className="reject-reason-section">
                <h3>Rejection Reason *</h3>
                <textarea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
                <p className="reject-hint">This reason will be visible to the provider.</p>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel-modal" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-confirm-reject"
                  onClick={handleReject}
                  disabled={actionLoading || !rejectReason.trim()}
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankVerifications;
