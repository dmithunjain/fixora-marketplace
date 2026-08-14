import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const Approvals = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getProviders();
      const pending = (response.data || []).filter(p => p.verificationStatus === 'pending');
      setProviders(pending);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await adminAPI.verifyProvider(id, 'approved');
      setShowModal(false);
      setSelectedProvider(null);
      fetchProviders();
    } catch (err) {
      console.error('Error approving provider:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      setActionLoading(true);
      await adminAPI.verifyProvider(selectedProvider._id, 'rejected');
      setShowModal(false);
      setSelectedProvider(null);
      setRejectReason('');
      fetchProviders();
    } catch (err) {
      console.error('Error rejecting provider:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
    setRejectReason('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="approvals-header">
            <h2>Provider Verification</h2>
            <div className="info-box">
              <p>Pending Verifications: <strong>{providers.length}</strong></p>
            </div>
          </div>

          <div className="verification-cards">
            {loading ? (
              <div className="loading-container">
                <div className="loading"></div>
              </div>
            ) : providers.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
                <h3>All Caught Up!</h3>
                <p>No pending verifications at the moment.</p>
              </div>
            ) : (
              providers.map((provider) => (
                <div key={provider._id} className="verification-card">
                  <div className="card-header">
                    <div className="provider-avatar">
                      {provider.fullName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="provider-info">
                      <h3>{provider.businessName}</h3>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: `${getStatusColor(provider.verificationStatus)}20`,
                          color: getStatusColor(provider.verificationStatus)
                        }}
                      >
                        {provider.verificationStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-details">
                    <div className="detail-row">
                      <span>📋 Service:</span>
                      <span>{provider.serviceCategory}</span>
                    </div>
                    <div className="detail-row">
                      <span>✉️ Email:</span>
                      <span>{provider.email || provider.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span>📞 Phone:</span>
                      <span>{provider.phone || provider.userId?.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span>🪪 Aadhaar:</span>
                      <span>{provider.aadharNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span>🔖 PAN:</span>
                      <span>{provider.panDetails?.panNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span>📍 City:</span>
                      <span>{provider.city || 'Not specified'}</span>
                    </div>
                    <div className="detail-row">
                      <span>📅 Applied:</span>
                      <span>{new Date(provider.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => handleApprove(provider._id)}
                      disabled={actionLoading}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleViewDetails(provider)}
                      disabled={actionLoading}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Details Modal */}
          {showModal && selectedProvider && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="provider-avatar lg">
                      {selectedProvider.fullName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedProvider.businessName}</h2>
                      <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                        {selectedProvider.email}
                      </p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="details-grid">
                    <div className="detail-section">
                      <h4>Personal Information</h4>
                      <div className="detail-item">
                        <span className="label">Full Name</span>
                        <span className="value">{selectedProvider.fullName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Phone</span>
                        <span className="value">{selectedProvider.phone || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Service Category</span>
                        <span className="value">{selectedProvider.serviceCategory}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Experience</span>
                        <span className="value">{selectedProvider.experience || 0} years</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">City</span>
                        <span className="value">{selectedProvider.city || 'Not specified'}</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Verification Documents</h4>
                      <div className="detail-item">
                        <span className="label">Aadhaar Number</span>
                        <span className="value">{selectedProvider.aadharNumber || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">PAN Number</span>
                        <span className="value">{selectedProvider.panDetails?.panNumber || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Certificate</span>
                        <span className="value">
                          {selectedProvider.certificate ? (
                            <a href={`http://localhost:5000/${selectedProvider.certificate}`} target="_blank" rel="noopener noreferrer">
                              View Certificate
                            </a>
                          ) : 'Not uploaded'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Bank Details</h4>
                      <div className="detail-item">
                        <span className="label">Account Holder</span>
                        <span className="value">{selectedProvider.bankDetails?.accountName || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Account Number</span>
                        <span className="value">
                          {selectedProvider.bankDetails?.accountNumber 
                            ? '****' + selectedProvider.bankDetails.accountNumber.slice(-4) 
                            : 'Not provided'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Bank Name</span>
                        <span className="value">{selectedProvider.bankDetails?.bankName || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">IFSC Code</span>
                        <span className="value">{selectedProvider.bankDetails?.ifscCode || 'Not provided'}</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Application Info</h4>
                      <div className="detail-item">
                        <span className="label">Applied On</span>
                        <span className="value">
                          {new Date(selectedProvider.createdAt).toLocaleDateString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Status</span>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: `${getStatusColor(selectedProvider.verificationStatus)}20`,
                            color: getStatusColor(selectedProvider.verificationStatus)
                          }}
                        >
                          {selectedProvider.verificationStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reject Reason Input */}
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>Reject Provider</h4>
                    <textarea
                      placeholder="Enter rejection reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '100px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
                
                <div className="modal-footer" style={{ 
                  padding: '20px 24px', 
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button 
                    className="btn-reject" 
                    onClick={handleReject}
                    disabled={actionLoading}
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none',
                      opacity: actionLoading ? 0.5 : 1
                    }}
                  >
                    {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button 
                    className="btn-approve"
                    onClick={() => handleApprove(selectedProvider._id)}
                    disabled={actionLoading}
                    style={{ opacity: actionLoading ? 0.5 : 1 }}
                  >
                    ✓ Approve Provider
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
