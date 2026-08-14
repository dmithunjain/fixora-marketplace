import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const WithdrawalApprovals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWithdrawals();
      setWithdrawals(response.data || []);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setModalType('approve');
    setShowModal(true);
  };

  const handleReject = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setModalType('reject');
    setRejectReason('');
    setShowModal(true);
  };

  const confirmApprove = async () => {
    try {
      setActionLoading(true);
      await adminAPI.approveWithdrawal(selectedWithdrawal._id);
      setShowModal(false);
      setSelectedWithdrawal(null);
      fetchWithdrawals();
    } catch (err) {
      console.error('Error approving withdrawal:', err);
      alert('Failed to approve withdrawal');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      setActionLoading(true);
      await adminAPI.rejectWithdrawal(selectedWithdrawal._id, rejectReason);
      setShowModal(false);
      setSelectedWithdrawal(null);
      setRejectReason('');
      fetchWithdrawals();
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
      alert('Failed to reject withdrawal');
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWithdrawal(null);
    setModalType(null);
    setRejectReason('');
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    if (activeTab === 'all') return true;
    return w.status === activeTab;
  });

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const completedCount = withdrawals.filter(w => w.status === 'completed').length;
  const rejectedCount = withdrawals.filter(w => w.status === 'rejected').length;

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#d97706', text: 'Pending' },
      completed: { bg: '#dcfce7', color: '#16a34a', text: 'Completed' },
      rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Rejected' }
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="approvals-header">
            <h2>Withdrawal Approvals</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="info-box">
                <p>Pending <strong style={{ color: '#d97706' }}>{pendingCount}</strong></p>
              </div>
              <div className="info-box">
                <p>Completed <strong style={{ color: '#059669' }}>{completedCount}</strong></p>
              </div>
              <div className="info-box">
                <p>Rejected <strong style={{ color: '#dc2626' }}>{rejectedCount}</strong></p>
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
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <span className="tab-icon">✓</span>
              Completed
              <span className="tab-count">{completedCount}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              <span className="tab-icon">✕</span>
              Rejected
              <span className="tab-count">{rejectedCount}</span>
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
            {loading ? (
              <div className="loading-container">
                <div className="loading"></div>
              </div>
            ) : filteredWithdrawals.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                  {activeTab === 'pending' ? '⏳' : activeTab === 'completed' ? '✓' : activeTab === 'rejected' ? '✕' : '📋'}
                </div>
                <h3>
                  {activeTab === 'pending' ? 'No Pending Withdrawals' : 
                   activeTab === 'completed' ? 'No Completed Withdrawals' : 
                   activeTab === 'rejected' ? 'No Rejected Withdrawals' : 'No Withdrawals'}
                </h3>
                <p>
                  {activeTab === 'pending' ? 'All withdrawal requests have been processed.' :
                   activeTab === 'completed' ? 'No completed withdrawals yet.' : 
                   activeTab === 'rejected' ? 'No rejected withdrawals.' : 'No withdrawal requests found.'}
                </p>
              </div>
            ) : (
              filteredWithdrawals.map((withdrawal) => {
                const statusInfo = getStatusBadge(withdrawal.status);
                return (
                  <div key={withdrawal._id} className="verification-card">
                    <div className="card-header">
                      <div className="provider-avatar" style={{ background: 'linear-gradient(135deg, #0891b2, #0284c7)' }}>
                        💰
                      </div>
                      <div className="provider-info">
                        <h3>{withdrawal.provider?.businessName || 'Unknown Provider'}</h3>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.color
                          }}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-details">
                      <div className="detail-row">
                        <span>💵 Amount:</span>
                        <span style={{ fontWeight: '700', fontSize: '16px', color: '#059669' }}>
                          ₹{withdrawal.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>🏦 Method:</span>
                        <span>{withdrawal.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>
                      </div>
                      {withdrawal.paymentMethod === 'bank_transfer' && withdrawal.bankDetails && (
                        <>
                          <div className="detail-row">
                            <span>🏛️ Bank:</span>
                            <span>{withdrawal.bankDetails.bankName || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <span>🔢 Account:</span>
                            <span style={{ fontFamily: 'monospace' }}>
                              ****{withdrawal.bankDetails.accountNumber?.slice(-4) || 'N/A'}
                            </span>
                          </div>
                        </>
                      )}
                      {withdrawal.paymentMethod === 'upi' && withdrawal.upiId && (
                        <div className="detail-row">
                          <span>📱 UPI ID:</span>
                          <span>{withdrawal.upiId}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span>📅 Requested:</span>
                        <span>{formatDate(withdrawal.createdAt)}</span>
                      </div>
                      {withdrawal.status === 'completed' && withdrawal.processedAt && (
                        <div className="detail-row">
                          <span>✅ Processed:</span>
                          <span>{formatDate(withdrawal.processedAt)}</span>
                        </div>
                      )}
                      {withdrawal.status === 'rejected' && withdrawal.rejectionReason && (
                        <div className="detail-row" style={{ color: '#dc2626' }}>
                          <span>❌ Reason:</span>
                          <span>{withdrawal.rejectionReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      {withdrawal.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(withdrawal)}
                            style={{ 
                              background: '#059669', 
                              color: 'white', 
                              border: 'none',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              flex: 1
                            }}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            onClick={() => handleReject(withdrawal)}
                            style={{ 
                              background: '#dc2626', 
                              color: 'white', 
                              border: 'none',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              flex: 1
                            }}
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                      {(withdrawal.status === 'completed' || withdrawal.status === 'rejected') && (
                        <div style={{ 
                          width: '100%', 
                          textAlign: 'center', 
                          padding: '10px',
                          background: withdrawal.status === 'completed' ? '#dcfce7' : '#fee2e2',
                          borderRadius: '8px',
                          color: withdrawal.status === 'completed' ? '#16a34a' : '#dc2626',
                          fontWeight: '600'
                        }}>
                          {withdrawal.status === 'completed' ? '✓ Payment Completed' : '✕ Payment Rejected'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Approve Modal */}
          {showModal && selectedWithdrawal && modalType === 'approve' && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#059669' }}>
                    Confirm Withdrawal Approval
                  </h2>
                  <button className="close-btn" onClick={closeModal}>×</button>
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
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#059669' }}>
                      ₹{selectedWithdrawal.amount?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                      to {selectedWithdrawal.provider?.businessName || 'Unknown Provider'}
                    </div>
                  </div>
                  
                  <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '600' }}>Payment Method</p>
                    <p style={{ margin: 0, color: '#666', textTransform: 'capitalize' }}>
                      {selectedWithdrawal.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                    </p>
                    {selectedWithdrawal.paymentMethod === 'bank_transfer' && selectedWithdrawal.bankDetails && (
                      <>
                        <p style={{ margin: '12px 0 8px', fontWeight: '600' }}>Bank Details</p>
                        <p style={{ margin: 0, color: '#666' }}>
                          {selectedWithdrawal.bankDetails.bankName}<br/>
                          A/C: ****{selectedWithdrawal.bankDetails.accountNumber?.slice(-4)}<br/>
                          {selectedWithdrawal.bankDetails.accountName}
                        </p>
                      </>
                    )}
                    {selectedWithdrawal.paymentMethod === 'upi' && (
                      <>
                        <p style={{ margin: '12px 0 8px', fontWeight: '600' }}>UPI Details</p>
                        <p style={{ margin: 0, color: '#666' }}>
                          {selectedWithdrawal.upiId}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button 
                    onClick={confirmApprove}
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
                    {actionLoading ? 'Processing...' : 'Confirm & Approve'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
          {showModal && selectedWithdrawal && modalType === 'reject' && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h2 style={{ margin: 0, fontSize: '20px', color: '#dc2626' }}>
                    Reject Withdrawal Request
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
                      ⚠️ You are about to reject this withdrawal
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Amount: <strong>₹{selectedWithdrawal.amount?.toLocaleString()}</strong><br/>
                      Provider: <strong>{selectedWithdrawal.provider?.businessName || 'Unknown'}</strong>
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
                      placeholder="Enter reason for rejecting this withdrawal request..."
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
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button 
                    onClick={confirmReject}
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
                    {actionLoading ? 'Rejecting...' : 'Reject Withdrawal'}
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

export default WithdrawalApprovals;
