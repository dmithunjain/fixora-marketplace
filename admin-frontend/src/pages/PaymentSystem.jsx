import React, { useState, useEffect } from "react";
import { paymentAPI } from "../services/paymentAPI";
import { PaymentQRCode } from "../components/QRCodeComponent";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/payment-system.css";

const PaymentSystem = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showQRModal, setShowQRModal] = useState(false);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPendingPayments();
    fetchStats();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentAPI.getPendingPayments();
      setPendingPayments(data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await paymentAPI.getPaymentStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSelectPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("upi");
  };

  const handleProcessPayment = async () => {
    if (!selectedPayment) return;

    if (paymentMethod === "upi") {
      setShowQRModal(true);
    } else if (paymentMethod === "bank_transfer") {
      await confirmPayment(selectedPayment._id);
    }
  };

  const handleConfirmQR = async () => {
    if (selectedPayment) {
      await confirmPayment(selectedPayment._id);
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      setProcessingPaymentId(paymentId);
      await paymentAPI.confirmPayment(paymentId);

      // Update local state
      setPendingPayments((prev) => prev.filter((p) => p._id !== paymentId));
      setShowQRModal(false);
      setSelectedPayment(null);
      setSuccessMessage("Payment processed successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        fetchStats();
      }, 3000);
    } catch (error) {
      alert("Error processing payment: " + error.message);
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const paginatedPayments = pendingPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(pendingPayments.length / itemsPerPage);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <div className="payment-system-container">
            <div className="payment-header">
              <h1>💳 Payment Processing System</h1>
              <p>Process payments to service providers</p>
            </div>

            {/* Statistics */}
            {stats && (
              <div className="payment-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <h3>{stats.pendingPaymentCount}</h3>
                  <p>Pending Payments</p>
                  <p className="stat-amount">₹{stats.pendingPaymentAmount?.toLocaleString("en-IN") || 0}</p>
                </div>
                <div className="stat-card total">
                  <div className="stat-icon">✓</div>
                  <h3>{stats.totalPaymentsMade}</h3>
                  <p>Total Paid</p>
                  <p className="stat-amount">₹{stats.totalPaymentAmount?.toLocaleString("en-IN") || 0}</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✕</div>
                  <h3>{stats.failedPayments}</h3>
                  <p>Failed</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">₹</div>
                  <h3>₹{stats.averagePayment?.toLocaleString("en-IN") || 0}</h3>
                  <p>Average Payment</p>
                </div>
              </div>
            )}

            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Main Content */}
            <div className="payment-layout">
              {/* Left: Pending Payments List */}
              <div className="payments-list-section">
                <h2>Pending Payments ({pendingPayments.length})</h2>

                {loading ? (
                  <div className="loading">Loading payments...</div>
                ) : paginatedPayments.length === 0 ? (
                  <div className="no-data">No pending payments</div>
                ) : (
                  <>
                    <div className="payments-grid">
                      {paginatedPayments.map((payment) => (
                        <div
                          key={payment._id}
                          className={`payment-item ${selectedPayment?._id === payment._id ? "selected" : ""}`}
                          onClick={() => handleSelectPayment(payment)}
                        >
                          <div className="payment-info">
                            <h4>{payment.providerName}</h4>
                            <p className="service">{payment.serviceName}</p>
                            <p className="booking-id">ID: {payment.paymentId}</p>
                            <div className="amount-breakdown">
                              <span>Net: ₹{payment.netAmount?.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                          <div className="selection-indicator">
                            {selectedPayment?._id === payment._id && <span>✓</span>}
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

              {/* Right: Payment Details & Processing */}
              <div className="payment-details-section">
                {selectedPayment ? (
                  <div className="payment-details">
                    <h2>Payment Details</h2>

                    <div className="details-card">
                      <div className="detail-row">
                        <label>Provider</label>
                        <span>{selectedPayment.providerName}</span>
                      </div>
                      <div className="detail-row">
                        <label>Service</label>
                        <span>{selectedPayment.serviceName}</span>
                      </div>
                      <div className="detail-row">
                        <label>Booking ID</label>
                        <span>{selectedPayment.paymentId}</span>
                      </div>
                    </div>

                    <div className="amount-section">
                      <h3>Amount Breakdown</h3>
                      <div className="amount-row">
                        <span>Gross Amount</span>
                        <strong>₹{selectedPayment.grossAmount?.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="amount-row">
                        <span>GST (18%)</span>
                        <strong>-₹{selectedPayment.gst?.toLocaleString("en-IN")}</strong>
                      </div>
                      <div className="amount-row total">
                        <span>Net Amount</span>
                        <strong>₹{selectedPayment.netAmount?.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    <div className="payment-method-section">
                      <h3>Payment Method</h3>
                      <div className="method-options">
                        <label className={`method-option ${paymentMethod === "upi" ? "active" : ""}`}>
                          <input
                            type="radio"
                            name="method"
                            value="upi"
                            checked={paymentMethod === "upi"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <span className="method-icon">📱</span>
                          <span>UPI</span>
                        </label>
                        <label className={`method-option ${paymentMethod === "bank_transfer" ? "active" : ""}`}>
                          <input
                            type="radio"
                            name="method"
                            value="bank_transfer"
                            checked={paymentMethod === "bank_transfer"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <span className="method-icon">🏦</span>
                          <span>Bank Transfer</span>
                        </label>
                        <label className={`method-option ${paymentMethod === "wallet" ? "active" : ""}`}>
                          <input
                            type="radio"
                            name="method"
                            value="wallet"
                            checked={paymentMethod === "wallet"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <span className="method-icon">👜</span>
                          <span>Wallet</span>
                        </label>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn btn-process"
                        onClick={handleProcessPayment}
                        disabled={processingPaymentId === selectedPayment._id}
                      >
                        {processingPaymentId === selectedPayment._id ? "Processing..." : "Process Payment"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-selection">
                    <div className="icon">👈</div>
                    <p>Select a payment to process</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI QR Modal */}
      {showQRModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQRModal(false)}>
              ✕
            </button>

            <div className="qr-modal-content">
              <h2>UPI Payment QR</h2>

              <PaymentQRCode amount={selectedPayment.netAmount} providerName={selectedPayment.providerName} />

              <div className="qr-instruction">
                <h3>How to pay:</h3>
                <ol>
                  <li>Open any UPI app (Google Pay, PhonePe, Paytm)</li>
                  <li>Scan the QR code above</li>
                  <li>Verify the amount and provider details</li>
                  <li>Complete the payment</li>
                  <li>Click "Payment Completed" below</li>
                </ol>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowQRModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmQR}
                  disabled={processingPaymentId === selectedPayment._id}
                >
                  {processingPaymentId === selectedPayment._id ? "Processing..." : "Payment Completed"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSystem;
