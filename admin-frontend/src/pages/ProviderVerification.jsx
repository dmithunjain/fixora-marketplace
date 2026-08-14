import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const ProviderVerification = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getProviders();
      setProviders(response.data || []);
    } catch (err) {
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (provider) => {
    setSelectedProvider(provider);
    setModalType('details');
    setReason('');
    setShowModal(true);
  };

  const handleVerifyClick = (provider) => {
    setSelectedProvider(provider);
    setModalType('verify');
    setReason('');
    setShowModal(true);
  };

  const handleBlockClick = (provider) => {
    setSelectedProvider(provider);
    setModalType('block');
    setReason('');
    setShowModal(true);
  };

  const handleVerify = async (status) => {
    if (status === 'rejected' && !reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      setActionLoading(true);
      const response = await adminAPI.verifyProvider(selectedProvider._id, status, reason);
      if (response.data?.success) {
        setShowModal(false);
        setSelectedProvider(null);
        setReason('');
        fetchProviders();
      } else {
        alert(response.data?.message || 'Failed to verify provider');
      }
    } catch (err) {
      console.error('Error verifying provider:', err);
      alert(err.response?.data?.message || 'Error verifying provider');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async (block) => {
    if (block && !reason.trim()) {
      alert('Please provide a reason for blocking');
      return;
    }
    try {
      setActionLoading(true);
      const response = await adminAPI.blockProvider(selectedProvider._id, block, reason);
      if (response.data?.success) {
        setShowModal(false);
        setSelectedProvider(null);
        setReason('');
        fetchProviders();
      } else {
        alert(response.data?.message || 'Failed to block/unblock provider');
      }
    } catch (err) {
      console.error('Error blocking provider:', err);
      alert(err.response?.data?.message || 'Error blocking provider');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (provider) => {
    setSelectedProvider(provider);
    setModalType('delete');
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedProvider?.isBlocked) {
      alert('Only blocked providers can be deleted');
      return;
    }
    try {
      setActionLoading(true);
      await adminAPI.deleteProvider(selectedProvider._id);
      setShowModal(false);
      setSelectedProvider(null);
      fetchProviders();
    } catch (err) {
      console.error('Error deleting provider:', err);
      alert(err.response?.data?.message || 'Error deleting provider');
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
    setModalType(null);
    setReason('');
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#d97706', text: 'Pending' },
      approved: { bg: '#dcfce7', color: '#16a34a', text: 'Verified' },
      rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Rejected' }
    };
    return colors[status] || colors.pending;
  };

  const filteredProviders = providers.filter(p => {
    if (activeTab === 'pending') return p.verificationStatus === 'pending';
    if (activeTab === 'verified') return p.verificationStatus === 'approved' && !p.isBlocked;
    if (activeTab === 'blocked') return p.isBlocked;
    return true;
  });

  const pendingCount = providers.filter(p => p.verificationStatus === 'pending').length;
  const verifiedCount = providers.filter(p => p.verificationStatus === 'approved' && !p.isBlocked).length;
  const blockedCount = providers.filter(p => p.isBlocked).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="approvals-header">
            <h2>Provider Verification</h2>
          </div>

          {/* Tabs */}
          <div className="verification-tabs">
            <button 
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="tab-icon">⏳</span>
              Pending Review
              <span className="tab-count">{pendingCount}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'verified' ? 'active' : ''}`}
              onClick={() => setActiveTab('verified')}
            >
              <span className="tab-icon">✓</span>
              Verified
              <span className="tab-count">{verifiedCount}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'blocked' ? 'active' : ''}`}
              onClick={() => setActiveTab('blocked')}
            >
              <span className="tab-icon">🚫</span>
              Blocked
              <span className="tab-count">{blockedCount}</span>
            </button>
          </div>

          {/* Provider List */}
          <div className="verification-cards">
            {loading ? (
              <div className="loading-container">
                <div className="loading"></div>
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  {activeTab === 'pending' ? '⏳' : activeTab === 'verified' ? '✓' : '🚫'}
                </div>
                <h3>
                  {activeTab === 'pending' ? 'No Pending Reviews' : 
                   activeTab === 'verified' ? 'No Verified Providers' : 'No Blocked Providers'}
                </h3>
                <p>
                  {activeTab === 'pending' ? 'All provider registrations have been reviewed.' :
                   activeTab === 'verified' ? 'No verified providers yet.' : 'No providers have been blocked.'}
                </p>
              </div>
            ) : (
              filteredProviders.map((provider) => {
                const statusInfo = getStatusBadge(provider.verificationStatus);
                return (
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
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.color
                          }}
                        >
                          {provider.isBlocked ? 'Blocked' : statusInfo.text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-details">
                      <div className="detail-row">
                        <span>📋 Service:</span>
                        <span>{provider.serviceCategory || 'Not specified'}</span>
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
                        <span>📍 City:</span>
                        <span>{provider.city || 'Not specified'}</span>
                      </div>
                      <div className="detail-row">
                        <span>📅 Applied:</span>
                        <span>{new Date(provider.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      {provider.isBlocked && provider.blockReason && (
                        <div className="detail-row" style={{ color: '#dc2626' }}>
                          <span>🚫 Block Reason:</span>
                          <span>{provider.blockReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button 
                        className="btn-view"
                        onClick={() => handleViewDetails(provider)}
                      >
                        View Details
                      </button>
                      
                      {activeTab === 'pending' && (
                        <>
                          <button 
                            className="btn-approve"
                            onClick={() => handleVerifyClick(provider)}
                          >
                            Verify
                          </button>
                        </>
                      )}
                      
                      {activeTab === 'verified' && (
                        <button 
                          className="btn-reject"
                          onClick={() => handleBlockClick(provider)}
                          style={{ background: '#dc2626', color: 'white', border: 'none' }}
                        >
                          Block
                        </button>
                      )}
                      
                      {activeTab === 'blocked' && (
                        <>
                          <button 
                            className="btn-approve"
                            onClick={() => handleBlock(false)}
                            style={{ background: '#10b981', border: 'none', color: 'white' }}
                          >
                            Unblock
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(provider)}
                            style={{ 
                              background: '#dc2626', 
                              color: 'white', 
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600'
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal */}
          {showModal && selectedProvider && modalType === 'details' && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="provider-avatar lg">
                      {selectedProvider.fullName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                        {selectedProvider.businessName}
                      </h2>
                      <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                        Provider Details
                      </p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeModal}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="details-grid">
                    <div className="detail-section">
                      <h4>👤 Personal Information</h4>
                      <div className="detail-item">
                        <span className="label">Full Name</span>
                        <span className="value">{selectedProvider.fullName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Email</span>
                        <span className="value">{selectedProvider.email || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Phone</span>
                        <span className="value">{selectedProvider.phone || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Service Category</span>
                        <span className="value">{selectedProvider.serviceCategory || 'Not specified'}</span>
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
                      <h4>📄 Documents</h4>
                      <div className="detail-item">
                        <span className="label">Aadhaar Number</span>
                        <span className="value" style={{ fontFamily: 'monospace' }}>
                          {selectedProvider.aadharNumber || 'Not provided'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">PAN Number</span>
                        <span className="value" style={{ fontFamily: 'monospace' }}>
                          {selectedProvider.panDetails?.panNumber || 'Not provided'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Certificate</span>
                        <span className="value">
                          {selectedProvider.certificate ? (
                            <a 
                              href={`http://localhost:5000/${selectedProvider.certificate}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: '#4f46e5' }}
                            >
                              View Certificate ↗
                            </a>
                          ) : 'Not uploaded'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>🏦 Bank Details</h4>
                      <div className="detail-item">
                        <span className="label">Account Holder</span>
                        <span className="value">{selectedProvider.bankDetails?.accountName || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Account Number</span>
                        <span className="value" style={{ fontFamily: 'monospace' }}>
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
                        <span className="value" style={{ fontFamily: 'monospace' }}>
                          {selectedProvider.bankDetails?.ifscCode || 'Not provided'}
                        </span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>📅 Status</h4>
                      <div className="detail-item">
                        <span className="label">Verification</span>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusBadge(selectedProvider.verificationStatus).bg,
                            color: getStatusBadge(selectedProvider.verificationStatus).color
                          }}
                        >
                          {getStatusBadge(selectedProvider.verificationStatus).text}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Account Status</span>
                        <span className="value">
                          {selectedProvider.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Can Login</span>
                        <span className="value">
                          {selectedProvider.isApproved && !selectedProvider.isBlocked ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {selectedProvider.isBlocked && selectedProvider.blockReason && (
                        <div className="detail-item">
                          <span className="label">Block Reason</span>
                          <span className="value" style={{ color: '#dc2626' }}>
                            {selectedProvider.blockReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Verify Modal */}
          {showModal && selectedProvider && modalType === 'verify' && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px' }}>
                    Verify Provider
                  </h2>
                  <button className="close-btn" onClick={closeModal}>×</button>
                </div>
                
                <div className="modal-body">
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ 
                      background: '#f3f4f6', 
                      padding: '16px', 
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <p style={{ margin: '0 0 8px', fontWeight: '600' }}>
                        {selectedProvider.businessName}
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {selectedProvider.email || selectedProvider.userId?.email}
                      </p>
                    </div>
                    
                    <p style={{ marginBottom: '16px', color: '#666' }}>
                      Choose an action for this provider registration:
                    </p>
                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ flex: 1, padding: '12px', border: '2px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>✓</div>
                        <div style={{ fontWeight: '600', color: '#10b981' }}>Verify</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Enable login</div>
                      </div>
                      <div style={{ flex: 1, padding: '12px', border: '2px solid #dc2626', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>✕</div>
                        <div style={{ fontWeight: '600', color: '#dc2626' }}>Reject</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Deny access</div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#dc2626'
                    }}>
                      Rejection Reason (Required for rejection)
                    </label>
                    <textarea
                      placeholder="Enter reason for rejection..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
                
                <div className="modal-footer" style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'flex-end' 
                }}>
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button 
                    onClick={() => handleVerify('rejected')}
                    disabled={actionLoading || !reason.trim()}
                    style={{ 
                      background: '#dc2626', 
                      color: 'white', 
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: actionLoading || !reason.trim() ? 0.5 : 1
                    }}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleVerify('approved')}
                    disabled={actionLoading}
                    style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: actionLoading ? 0.5 : 1
                    }}
                  >
                    Verify Provider
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Block Modal */}
          {showModal && selectedProvider && modalType === 'block' && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#dc2626' }}>
                    Block Provider
                  </h2>
                  <button className="close-btn" onClick={closeModal}>×</button>
                </div>
                
                <div className="modal-body">
                  <div style={{ 
                    background: '#fef2f2', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #fecaca'
                  }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#dc2626' }}>
                      ⚠️ You are about to block this provider
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      {selectedProvider.businessName} will not be able to login or access their account.
                    </p>
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      Block Reason (Required)
                    </label>
                    <textarea
                      placeholder="Enter reason for blocking this provider..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
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
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'flex-end' 
                }}>
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button 
                    onClick={() => handleBlock(true)}
                    disabled={actionLoading || !reason.trim()}
                    style={{ 
                      background: '#dc2626', 
                      color: 'white', 
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: actionLoading || !reason.trim() ? 0.5 : 1
                    }}
                  >
                    Block Provider
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showModal && selectedProvider && modalType === 'delete' && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#dc2626' }}>
                    Delete Provider
                  </h2>
                  <button className="close-btn" onClick={closeModal}>×</button>
                </div>
                
                <div className="modal-body">
                  <div style={{ 
                    background: '#fef2f2', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #fecaca'
                  }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#dc2626' }}>
                      ⚠️ Warning: This action cannot be undone
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      You are about to permanently delete this provider and their user account.
                    </p>
                  </div>

                  <div style={{ 
                    background: '#f3f4f6', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '600' }}>{selectedProvider.businessName}</p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      {selectedProvider.email || selectedProvider.userId?.email}
                    </p>
                  </div>

                  <p style={{ marginBottom: '16px', color: '#666' }}>
                    <strong>What will be deleted:</strong>
                  </p>
                  <ul style={{ color: '#666', marginBottom: '16px', paddingLeft: '20px' }}>
                    <li>Provider profile and registration data</li>
                    <li>User account (can register again with same email/phone)</li>
                    <li>Associated bookings and notifications</li>
                  </ul>
                  
                  <p style={{ color: '#10b981', fontSize: '14px' }}>
                    ✓ After deletion, this user can register a new account with the same details.
                  </p>
                </div>
                
                <div className="modal-footer" style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  justifyContent: 'flex-end' 
                }}>
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button 
                    onClick={handleDelete}
                    disabled={actionLoading}
                    style={{ 
                      background: '#dc2626', 
                      color: 'white', 
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: actionLoading ? 0.5 : 1
                    }}
                  >
                    {actionLoading ? 'Deleting...' : 'Delete Permanently'}
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

export default ProviderVerification;
