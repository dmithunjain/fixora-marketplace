import React, { useState, useEffect } from "react";
import { workproofAPI } from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/work-verification.css";

const AdminWorkVerification = () => {
  const [workProofs, setWorkProofs] = useState([]);
  const [filteredProofs, setFilteredProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProof, setSelectedProof] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchWorkProofs();
    fetchStats();
  }, []);

  useEffect(() => {
    filterProofs();
  }, [workProofs, statusFilter, searchTerm]);

  const fetchWorkProofs = async () => {
    try {
      setLoading(true);
      const data = await workproofAPI.getAll();

      // Normalize fields to match component expectations
      const normalized = (data || []).map((p) => ({
        _id: p.id || p._id || p.workProofId || p.bookingId,
        workImage: p.workImage || p.imageThumbnail || p.image || "/placeholder.jpg",
        workProofId: p.id || p.workProofId || p.bookingId,
        providerName: p.providerName || p.provider || p.providerName,
        serviceName: p.serviceName || p.service || p.serviceName,
        verificationStatus: (p.verificationStatus || p.status || "pending").toString().toLowerCase(),
        amountEarned: p.amountEarned || p.amount || p.netAmount || 0,
        gst: p.gstAmount || p.gst || 0,
        netAmount: p.netAmount || p.amountEarned || p.netAmount || 0,
        verifiedBy: p.verifiedBy || null,
        verifiedDate: p.verifiedDate || p.verifiedAt || null,
        rejectionReason: p.rejectionReason || null
      }));

      setWorkProofs(normalized);
    } catch (error) {
      console.error("Error fetching work proofs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await workproofAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filterProofs = () => {
    let filtered = workProofs;

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((proof) => proof.verificationStatus === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (proof) =>
          proof.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proof.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proof.workProofId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProofs(filtered);
    setCurrentPage(1);
  };

  const handleVerify = async (proofId) => {
    try {
      setVerifyingId(proofId);
      await workproofAPI.verifyWorkProof(proofId, "Admin");

      // Update local state
      setWorkProofs((prev) =>
        prev.map((proof) =>
          proof._id === proofId
            ? { ...proof, verificationStatus: "verified", verifiedDate: new Date() }
            : proof
        )
      );

      setShowModal(false);
      fetchStats();
    } catch (error) {
      alert("Error verifying work proof: " + error.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReject = async (proofId) => {
    try {
      setRejectingId(proofId);
      await workproofAPI.rejectWorkProof(proofId, rejectionReason);

      // Update local state
      setWorkProofs((prev) =>
        prev.map((proof) =>
          proof._id === proofId
            ? { ...proof, verificationStatus: "rejected", rejectionReason }
            : proof
        )
      );

      setShowRejectModal(false);
      setRejectionReason("");
      fetchStats();
    } catch (error) {
      alert("Error rejecting work proof: " + error.message);
    } finally {
      setRejectingId(null);
    }
  };

  const paginatedProofs = filteredProofs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProofs.length / itemsPerPage);

  const getStatusBadgeClass = (status) => {
    return `badge badge-${status}`;
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <div className="work-verification-container">
            <div className="verification-header">
              <h1>✓ Work Verification</h1>
              <p>Review and approve service provider work proofs</p>
            </div>

            {/* Statistics */}
            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <h3>{stats.total}</h3>
                    <p>Total Submissions</p>
                  </div>
                </div>
                <div className="stat-card verified">
                  <div className="stat-icon">✓</div>
                  <div className="stat-content">
                    <h3>{stats.verified}</h3>
                    <p>Verified</p>
                  </div>
                </div>
                <div className="stat-card pending">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-content">
                    <h3>{stats.pending}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="stat-card rejected">
                  <div className="stat-icon">✕</div>
                  <div className="stat-content">
                    <h3>{stats.rejected}</h3>
                    <p>Rejected</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filters and Search */}
            <div className="verification-controls">
              <div className="filter-group">
                <label>Status Filter</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search by provider, service, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Work Proofs Grid */}
            {loading ? (
              <div className="loading">Loading work proofs...</div>
            ) : paginatedProofs.length === 0 ? (
              <div className="no-data">No work proofs found</div>
            ) : (
              <>
                <div className="work-proofs-grid">
                  {paginatedProofs.map((proof) => (
                    <div key={proof._id} className="proof-card">
                      <div className="proof-image">
                        <img src={proof.workImage || "/placeholder.jpg"} alt="Work Proof" />
                        <span className={getStatusBadgeClass(proof.verificationStatus)}>
                          {proof.verificationStatus.toUpperCase()}
                        </span>
                      </div>

                      <div className="proof-details">
                        <h3>{proof.providerName}</h3>
                        <p className="service-name">{proof.serviceName}</p>
                        <p className="booking-id">ID: {proof.workProofId}</p>

                        <div className="amount-section">
                          <div className="amount-item">
                            <span>Gross</span>
                            <strong>₹{proof.amountEarned}</strong>
                          </div>
                          <div className="amount-item">
                            <span>GST (18%)</span>
                            <strong>-₹{proof.gst}</strong>
                          </div>
                          <div className="amount-item total">
                            <span>Net</span>
                            <strong>₹{proof.netAmount}</strong>
                          </div>
                        </div>

                        {proof.verificationStatus === "pending" && (
                          <div className="proof-actions">
                            <button
                              className="btn btn-verify"
                              onClick={() => {
                                setSelectedProof(proof);
                                setShowModal(true);
                              }}
                              disabled={verifyingId === proof._id}
                            >
                              ✓ Verify
                            </button>
                            <button
                              className="btn btn-reject"
                              onClick={() => {
                                setSelectedProof(proof);
                                setShowRejectModal(true);
                              }}
                              disabled={rejectingId === proof._id}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}

                        {proof.verificationStatus === "verified" && (
                          <div className="verified-by">
                            <p>Verified by {proof.verifiedBy} on {new Date(proof.verifiedDate).toLocaleDateString()}</p>
                          </div>
                        )}

                        {proof.verificationStatus === "rejected" && (
                          <div className="rejection-reason">
                            <p>Reason: {proof.rejectionReason}</p>
                          </div>
                        )}

                        <button
                          className="btn btn-view-full"
                          onClick={() => window.open(proof.workImage, "_blank")}
                        >
                          View Full Image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-pagination"
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn-pagination"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Verify Modal */}
      {showModal && selectedProof && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Verification</h2>
            <p>Are you sure you want to verify this work proof?</p>
            <div className="modal-details">
              <p>
                <strong>Provider:</strong> {selectedProof.providerName}
              </p>
              <p>
                <strong>Service:</strong> {selectedProof.serviceName}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedProof.netAmount} (net)
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleVerify(selectedProof._id)}
                className="btn btn-primary"
                disabled={verifyingId === selectedProof._id}
              >
                {verifyingId === selectedProof._id ? "Verifying..." : "Confirm Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProof && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Work Proof</h2>
            <p>Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows="4"
              className="reject-textarea"
            />
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedProof._id)}
                className="btn btn-danger"
                disabled={!rejectionReason.trim() || rejectingId === selectedProof._id}
              >
                {rejectingId === selectedProof._id ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorkVerification;
