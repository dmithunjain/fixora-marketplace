import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const KYCVerifications = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [verifyType, setVerifyType] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await adminAPI.getProviders();
      setProviders(response.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setActionLoading(true);
    try {
      if (verifyType === "bank") {
        await adminAPI.verifyBank(selectedProvider._id);
      } else if (verifyType === "pan") {
        await adminAPI.verifyPan(selectedProvider._id);
      } else if (verifyType === "upi") {
        await adminAPI.verifyUpi(selectedProvider._id);
      }
      setShowModal(false);
      fetchProviders();
    } catch (error) {
      console.error("Error verifying:", error);
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
      await adminAPI.rejectKyc(selectedProvider._id, verifyType, rejectReason);
      setShowModal(false);
      setRejectReason("");
      fetchProviders();
    } catch (error) {
      console.error("Error rejecting:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openVerifyDialog = (provider, type) => {
    setSelectedProvider(provider);
    setVerifyType(type);
    setModalType('verify');
    setShowModal(true);
  };

  const openRejectDialog = (provider, type) => {
    setSelectedProvider(provider);
    setVerifyType(type);
    setModalType('reject');
    setRejectReason("");
    setShowModal(true);
  };

  const viewProviderDetails = (provider) => {
    setSelectedProvider(provider);
    setModalType('details');
    setShowModal(true);
  };

  const getStatusBadge = (isVerified) => (
    isVerified ? (
      <span className="status-badge status-approved">Verified</span>
    ) : (
      <span className="status-badge status-pending">Pending</span>
    )
  );

  const filteredProviders = providers.filter(p => {
    if (activeTab === 'pending') {
      return !p.bankDetails?.isVerified || !p.panDetails?.isVerified || !p.upiDetails?.isVerified;
    }
    if (activeTab === 'verified') {
      return p.bankDetails?.isVerified && p.panDetails?.isVerified && p.upiDetails?.isVerified;
    }
    return true;
  });

  const pendingCount = providers.filter(p => !p.bankDetails?.isVerified || !p.panDetails?.isVerified || !p.upiDetails?.isVerified).length;
  const verifiedCount = providers.filter(p => p.bankDetails?.isVerified && p.panDetails?.isVerified && p.upiDetails?.isVerified).length;

  const getTypeName = () => {
    if (verifyType === "bank") return "Bank Details";
    if (verifyType === "pan") return "PAN Details";
    if (verifyType === "upi") return "UPI Details";
    return "KYC Details";
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="page-content">
            <div className="loading-container">
              <div className="loading"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="approvals-header">
            <h2>KYC Verifications</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="info-box">
                <p>Pending <strong style={{ color: '#d97706' }}>{pendingCount}</strong></p>
              </div>
              <div className="info-box">
                <p>Verified <strong style={{ color: '#059669' }}>{verifiedCount}</strong></p>
              </div>
            </div>
          </div>

          <div className="verification-tabs">
            <button 
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="tab-icon">⏳</span>
              Pending
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
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <span className="tab-icon">📋</span>
              All
            </button>
          </div>

          <div className="verification-cards">
            {filteredProviders.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  {activeTab === 'pending' ? '✅' : '📋'}
                </div>
                <h3>
                  {activeTab === 'pending' ? 'All KYC Verified!' : 
                   activeTab === 'verified' ? 'No Fully Verified Providers' : 'No Providers'}
                </h3>
                <p>
                  {activeTab === 'pending' ? 'All providers have completed their KYC verification.' :
                   activeTab === 'verified' ? 'No providers have completed all KYC verification.' : 'No providers found.'}
                </p>
              </div>
            ) : (
              filteredProviders.map((provider) => (
                <div key={provider._id} className="verification-card">
                  <div className="card-header">
                    <div className="provider-avatar" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                      {provider.businessName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="provider-info">
                      <h3>{provider.businessName}</h3>
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        {provider.serviceCategory || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  <div className="card-details">
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        📧 {provider.email || provider.userId?.email}
                      </span>
                    </div>

                    {/* Bank Details */}
                    <div className="detail-row">
                      <span>🏦 Bank:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {provider.bankDetails?.accountNumber ? (
                          <>
                            <span style={{ fontFamily: 'monospace' }}>
                              ****{provider.bankDetails.accountNumber?.slice(-4)}
                            </span>
                            {getStatusBadge(provider.bankDetails.isVerified)}
                          </>
                        ) : (
                          <span style={{ color: '#dc2626' }}>Not provided</span>
                        )}
                      </div>
                    </div>

                    {/* PAN Details */}
                    <div className="detail-row">
                      <span>🪪 PAN:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {provider.panDetails?.panNumber ? (
                          <>
                            <span style={{ fontFamily: 'monospace' }}>{provider.panDetails.panNumber}</span>
                            {getStatusBadge(provider.panDetails.isVerified)}
                          </>
                        ) : (
                          <span style={{ color: '#dc2626' }}>Not provided</span>
                        )}
                      </div>
                    </div>

                    {/* UPI Details */}
                    <div className="detail-row">
                      <span>📱 UPI:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {provider.upiDetails?.upiId ? (
                          <>
                            <span>{provider.upiDetails.upiId}</span>
                            {getStatusBadge(provider.upiDetails.isVerified)}
                          </>
                        ) : (
                          <span style={{ color: '#dc2626' }}>Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="btn-view"
                      onClick={() => viewProviderDetails(provider)}
                    >
                      View Full Details
                    </button>
                    
                    {!provider.bankDetails?.isVerified && provider.bankDetails?.accountNumber && (
                      <>
                        <button 
                          onClick={() => openVerifyDialog(provider, 'bank')}
                          style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          ✓ Verify Bank
                        </button>
                      </>
                    )}
                    
                    {!provider.panDetails?.isVerified && provider.panDetails?.panNumber && (
                      <button 
                        onClick={() => openVerifyDialog(provider, 'pan')}
                        style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        ✓ Verify PAN
                      </button>
                    )}
                    
                    {!provider.upiDetails?.isVerified && provider.upiDetails?.upiId && (
                      <button 
                        onClick={() => openVerifyDialog(provider, 'upi')}
                        style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        ✓ Verify UPI
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Full Details Modal */}
          {showModal && selectedProvider && modalType === 'details' && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="provider-avatar lg" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                      {selectedProvider.businessName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                        {selectedProvider.businessName}
                      </h2>
                      <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                        Complete KYC Details
                      </p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="details-grid">
                    {/* Personal Information */}
                    <div className="detail-section">
                      <h4>👤 Personal Information</h4>
                      <div className="detail-item">
                        <span className="label">Full Name</span>
                        <span className="value">{selectedProvider.fullName || 'N/A'}</span>
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
                        <span className="value">{selectedProvider.serviceCategory || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">City</span>
                        <span className="value">{selectedProvider.city || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="detail-section">
                      <h4>🏦 Bank Account Details</h4>
                      {selectedProvider.bankDetails?.accountNumber ? (
                        <>
                          <div className="detail-item">
                            <span className="label">Account Name</span>
                            <span className="value">{selectedProvider.bankDetails.accountName || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Account Number</span>
                            <span className="value" style={{ fontFamily: 'monospace' }}>
                              {selectedProvider.bankDetails.accountNumber}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Bank Name</span>
                            <span className="value">{selectedProvider.bankDetails.bankName || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">IFSC Code</span>
                            <span className="value" style={{ fontFamily: 'monospace' }}>
                              {selectedProvider.bankDetails.ifscCode || 'N/A'}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Status</span>
                            <span>{getStatusBadge(selectedProvider.bankDetails.isVerified)}</span>
                          </div>
                          {!selectedProvider.bankDetails.isVerified && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                onClick={() => { setModalType('verify'); setVerifyType('bank'); }}
                                style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                Verify Bank
                              </button>
                              <button 
                                onClick={() => { setModalType('reject'); setVerifyType('bank'); setRejectReason(""); }}
                                style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p style={{ color: '#dc2626', textAlign: 'center', padding: '20px' }}>
                          Bank details not provided
                        </p>
                      )}
                    </div>

                    {/* PAN Details */}
                    <div className="detail-section">
                      <h4>🪪 PAN Card Details</h4>
                      {selectedProvider.panDetails?.panNumber ? (
                        <>
                          <div className="detail-item">
                            <span className="label">PAN Number</span>
                            <span className="value" style={{ fontFamily: 'monospace' }}>
                              {selectedProvider.panDetails.panNumber}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Name on PAN</span>
                            <span className="value">{selectedProvider.panDetails.panName || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Status</span>
                            <span>{getStatusBadge(selectedProvider.panDetails.isVerified)}</span>
                          </div>
                          {!selectedProvider.panDetails.isVerified && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                onClick={() => { setModalType('verify'); setVerifyType('pan'); }}
                                style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                Verify PAN
                              </button>
                              <button 
                                onClick={() => { setModalType('reject'); setVerifyType('pan'); setRejectReason(""); }}
                                style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p style={{ color: '#dc2626', textAlign: 'center', padding: '20px' }}>
                          PAN details not provided
                        </p>
                      )}
                    </div>

                    {/* UPI Details */}
                    <div className="detail-section">
                      <h4>📱 UPI Details</h4>
                      {selectedProvider.upiDetails?.upiId ? (
                        <>
                          <div className="detail-item">
                            <span className="label">UPI ID</span>
                            <span className="value">{selectedProvider.upiDetails.upiId}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Status</span>
                            <span>{getStatusBadge(selectedProvider.upiDetails.isVerified)}</span>
                          </div>
                          {!selectedProvider.upiDetails.isVerified && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                onClick={() => { setModalType('verify'); setVerifyType('upi'); }}
                                style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                Verify UPI
                              </button>
                              <button 
                                onClick={() => { setModalType('reject'); setVerifyType('upi'); setRejectReason(""); }}
                                style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <p style={{ color: '#dc2626', textAlign: 'center', padding: '20px' }}>
                          UPI details not provided
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Verify Modal */}
          {showModal && selectedProvider && modalType === 'verify' && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#059669' }}>
                    Verify {getTypeName()}
                  </h2>
                  <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div style={{ 
                    background: '#ecfdf5', 
                    padding: '20px', 
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid #a7f3d0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                    <p style={{ margin: 0, fontWeight: '600', color: '#059669' }}>
                      Confirm Verification
                    </p>
                    <p style={{ margin: '8px 0 0', color: '#666', fontSize: '14px' }}>
                      Are you sure you want to verify {getTypeName().toLowerCase()} for <strong>{selectedProvider.businessName}</strong>?
                    </p>
                  </div>
                  
                  {verifyType === 'bank' && selectedProvider.bankDetails && (
                    <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px', fontWeight: '600' }}>Bank Details:</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {selectedProvider.bankDetails.bankName}<br/>
                        A/C: {selectedProvider.bankDetails.accountNumber}<br/>
                        IFSC: {selectedProvider.bankDetails.ifscCode}
                      </p>
                    </div>
                  )}
                  
                  {verifyType === 'pan' && selectedProvider.panDetails && (
                    <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px', fontWeight: '600' }}>PAN Details:</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        PAN: {selectedProvider.panDetails.panNumber}<br/>
                        Name: {selectedProvider.panDetails.panName}
                      </p>
                    </div>
                  )}
                  
                  {verifyType === 'upi' && selectedProvider.upiDetails && (
                    <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px', fontWeight: '600' }}>UPI Details:</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        UPI ID: {selectedProvider.upiDetails.upiId}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button 
                    onClick={handleVerify}
                    disabled={actionLoading}
                    style={{ 
                      background: '#059669', 
                      color: 'white', 
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: actionLoading ? 0.5 : 1
                    }}
                  >
                    {actionLoading ? 'Verifying...' : 'Confirm Verification'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showModal && selectedProvider && modalType === 'reject' && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#dc2626' }}>
                    Reject {getTypeName()}
                  </h2>
                  <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
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
                      ⚠️ You are about to reject {getTypeName().toLowerCase()}
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Provider will be notified and asked to resubmit correct details.
                    </p>
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      Rejection Reason <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <textarea
                      placeholder="Enter reason for rejection..."
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
                
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button 
                    onClick={handleReject}
                    disabled={actionLoading || !rejectReason.trim()}
                    style={{ 
                      background: '#dc2626', 
                      color: 'white', 
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: actionLoading || !rejectReason.trim() ? 0.5 : 1
                    }}
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject'}
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

export default KYCVerifications;
