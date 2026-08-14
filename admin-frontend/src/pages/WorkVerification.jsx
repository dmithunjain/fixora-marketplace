import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import workProofs from '../data/workProofs';
import '../styles/provider-payments.css';

const WorkVerification = () => {
  const [selectedProof, setSelectedProof] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  // Filter and search work proofs
  const filteredProofs = useMemo(() => {
    let result = [...workProofs];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(p => p.verificationStatus.toLowerCase() === filterStatus.toLowerCase());
    }

    // Search
    if (searchTerm) {
      result = result.filter(
        p =>
          p.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [filterStatus, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredProofs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProofs = filteredProofs.slice(startIndex, startIndex + pageSize);

  const stats = useMemo(() => {
    const total = workProofs.length;
    const verified = workProofs.filter(p => p.verificationStatus === 'Verified').length;
    const pending = workProofs.filter(p => p.verificationStatus === 'Pending').length;
    const rejected = workProofs.filter(p => p.verificationStatus === 'Rejected').length;

    return { total, verified, pending, rejected };
  }, []);

  const handleVerify = (proof) => {
    console.log('Verifying work proof:', proof.id);
    alert(`Work proof ${proof.id} verified successfully!`);
  };

  const handleReject = (proof) => {
    console.log('Rejecting work proof:', proof.id);
    alert(`Work proof ${proof.id} rejected. Notification sent to provider.`);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Work Verification & Proof Review</h1>
            <p>Review and verify service provider work proofs</p>
          </div>

          {/* Verification Statistics */}
          <div className="verification-stats">
            <div className="stat-card stat-blue">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Submissions</div>
            </div>
            <div className="stat-card stat-green">
              <div className="stat-number">{stats.verified}</div>
              <div className="stat-label">Verified</div>
            </div>
            <div className="stat-card stat-yellow">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card stat-red">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="verification-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by provider name, booking ID, or service..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-group">
              <label>Status Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Work Proofs Grid/List */}
          <div className="work-proofs-container">
            {paginatedProofs.length > 0 ? (
              <div className="proofs-grid">
                {paginatedProofs.map((proof, index) => (
                  <div key={index} className="proof-card">
                    {/* Work Image */}
                    <div
                      className="work-image-container"
                      onClick={() => setSelectedProof(proof)}
                    >
                      <div className="work-image-placeholder">
                        <span className="image-icon">📷</span>
                        <p>Work Proof Image</p>
                        <small>{proof.serviceName}</small>
                      </div>
                      <div className="image-overlay">
                        <button className="btn-view-image">View Full Image</button>
                      </div>
                    </div>

                    {/* Proof Details */}
                    <div className="proof-details">
                      <h3 className="provider-name">{proof.providerName}</h3>
                      <p className="service-name">
                        <strong>{proof.serviceName}</strong>
                      </p>

                      <div className="proof-meta">
                        <div className="meta-item">
                          <span className="label">Booking ID:</span>
                          <span className="value">{proof.bookingId}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Completion Date:</span>
                          <span className="value">{proof.completionDate}</span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Amount Earned:</span>
                          <span className="value amount">₹{proof.amountEarned.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="proof-status">
                        <span
                          className={`status-badge status-${proof.verificationStatus.toLowerCase()}`}
                        >
                          {proof.verificationStatus}
                        </span>
                        {proof.verificationStatus === 'Rejected' && proof.rejectionReason && (
                          <p className="rejection-reason">
                            <strong>Reason:</strong> {proof.rejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {proof.verificationStatus === 'Pending' && (
                        <div className="proof-actions">
                          <button
                            className="btn-approve"
                            onClick={() => handleVerify(proof)}
                          >
                            ✓ Verify Work
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReject(proof)}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}

                      {proof.verificationStatus === 'Verified' && (
                        <div className="verified-info">
                          <p>
                            <strong>✓ Verified by:</strong> {proof.verifiedBy}
                          </p>
                          <p>
                            <strong>Date:</strong> {proof.verifiedDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-proofs">
                <p>No work proofs found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}

          {/* Image Preview Modal */}
          {selectedProof && (
            <div className="image-modal" onClick={() => setSelectedProof(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setSelectedProof(null)}>
                  ✕
                </button>
                <div className="image-preview-container">
                  <div className="image-placeholder-large">
                    <span className="image-icon-large">📷</span>
                    <p>Work Proof Image</p>
                    <p className="file-name">{selectedProof.workImage}</p>
                  </div>
                  <div className="image-details">
                    <h3>{selectedProof.providerName}</h3>
                    <p className="service">{selectedProof.serviceName}</p>
                    <div className="details-list">
                      <div>
                        <strong>Booking ID:</strong> {selectedProof.bookingId}
                      </div>
                      <div>
                        <strong>Service Date:</strong> {selectedProof.serviceDate} at{' '}
                        {selectedProof.serviceTime}
                      </div>
                      <div>
                        <strong>Amount:</strong> ₹{selectedProof.amountEarned.toLocaleString('en-IN')}
                      </div>
                      <div>
                        <strong>Status:</strong>{' '}
                        <span className={`status-badge status-${selectedProof.verificationStatus.toLowerCase()}`}>
                          {selectedProof.verificationStatus}
                        </span>
                      </div>
                      <div>
                        <strong>Description:</strong> {selectedProof.description}
                      </div>
                    </div>
                    {selectedProof.verificationStatus === 'Pending' && (
                      <div className="modal-actions">
                        <button className="btn-approve" onClick={() => handleVerify(selectedProof)}>
                          ✓ Verify Work
                        </button>
                        <button className="btn-reject" onClick={() => handleReject(selectedProof)}>
                          ✕ Reject Work
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkVerification;
