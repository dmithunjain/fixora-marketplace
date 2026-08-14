import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { PaymentQRCode } from '../components/QRCodeComponent';
import { pendingPayments } from '../data/providerPayments';
import { getServiceImage } from '../utils/serviceImages';
import '../styles/provider-payments.css';

const PaymentProcessing = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showQRModal, setShowQRModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  // Filter pending payments
  const filteredPayments = useMemo(() => {
    return pendingPayments.filter(
      p =>
        p.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + pageSize);

  const stats = useMemo(() => {
    return {
      totalPending: pendingPayments.length,
      totalAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
      readyToPay: pendingPayments.length
    };
  }, []);

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
  };

  const initiatePayment = (method) => {
    if (!selectedPayment) return;
    setPaymentMethod(method);
    if (method === 'UPI') {
      setShowQRModal(true);
    } else {
      handlePaymentConfirmation();
    }
  };

  const handlePaymentConfirmation = () => {
    if (selectedPayment) {
      alert(
        `Payment of ₹${selectedPayment.amount.toLocaleString('en-IN')} initiated to ${selectedPayment.providerName} via ${paymentMethod}`
      );
      setShowQRModal(false);
      setSelectedPayment(null);
      setPaymentMethod('UPI');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Payment Processing</h1>
            <p>Initiate and process payments to service providers</p>
          </div>

          {/* Payment Statistics */}
          <div className="payment-stats">
            <div className="stat-box">
              <span className="stat-icon">⏳</span>
              <div>
                <h4>Pending Payments</h4>
                <p>{stats.totalPending}</p>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">💵</span>
              <div>
                <h4>Total Amount</h4>
                <p>₹{stats.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">✓</span>
              <div>
                <h4>Ready to Pay</h4>
                <p>{stats.readyToPay}</p>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="payment-layout">
            {/* Pending Payments List */}
            <div className="payments-list-section">
              <div className="list-header">
                <h2>Pending Payments</h2>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search provider, service, or booking..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>

              <div className="payments-grid">
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment, index) => (
                    <div
                      key={index}
                      className={`payment-item ${selectedPayment?.paymentId === payment.paymentId ? 'selected' : ''}`}
                      onClick={() => handlePaymentClick(payment)}
                    >
                      <div className="payment-header">
                        <h3>{payment.providerName}</h3>
                        <span className="service-badge">{payment.serviceName}</span>
                      </div>

                      <div className="payment-info">
                        <div className="info-row">
                          <span className="label">Booking:</span>
                          <span className="value">{payment.bookingId}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Verified:</span>
                          <span className="value">{payment.verifiedDate}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Waiting:</span>
                          <span className="value">
                            {payment.daysWaitingForPayment} days
                          </span>
                        </div>
                      </div>

                      <div className="amount-section">
                        <div className="amount-item">
                          <span className="label">Gross Amount</span>
                          <span className="value">₹{payment.grossAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="divider-line" />
                        <div className="amount-item">
                          <span className="label" style={{ fontSize: '12px' }}>
                            GST (18%)
                          </span>
                          <span className="value" style={{ fontSize: '12px' }}>
                            -₹{payment.gstAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="final-amount">
                          <span className="label">Net Amount</span>
                          <span className="amount">₹{payment.amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="payment-details">
                        <small>UPI: {payment.upiId}</small>
                        <small>Bank: ***{payment.bankAccountLast4}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-payments">
                    <p>No pending payments found</p>
                  </div>
                )}
              </div>

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
            </div>

            {/* Payment Details & Method Selection */}
            {selectedPayment && (
              <div className="payment-detail-section">
                <div className="detail-card">
                  <h2>Payment Details</h2>

                  <div className="provider-info">
                    <div className="avatar">
                      <img
                        src={getServiceImage(selectedPayment.serviceName || selectedPayment.serviceType, selectedPayment.providerId)}
                        alt={selectedPayment.serviceName}
                        className="avatar-img"
                      />
                    </div>
                    <div className="info">
                      <h3>{selectedPayment.providerName}</h3>
                      <p>{selectedPayment.serviceName}</p>
                    </div>
                  </div>

                  <div className="detail-rows">
                    <div className="detail-row">
                      <span>Booking ID</span>
                      <span className="value">{selectedPayment.bookingId}</span>
                    </div>
                    <div className="detail-row">
                      <span>Service</span>
                      <span className="value">{selectedPayment.serviceName}</span>
                    </div>
                    <div className="detail-row">
                      <span>Gross Amount</span>
                      <span className="value">
                        ₹{selectedPayment.grossAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="detail-row tax">
                      <span>GST (18%)</span>
                      <span className="value">
                        -₹{selectedPayment.gstAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="detail-row final">
                      <span>Net Amount Payable</span>
                      <span className="value amount">
                        ₹{selectedPayment.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="payment-methods">
                    <h4>Select Payment Method</h4>
                    <div className="methods-grid">
                      <button
                        className={`method-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('UPI')}
                      >
                        <span className="method-icon">📱</span>
                        <span>UPI</span>
                      </button>
                      <button
                        className={`method-btn ${paymentMethod === 'Bank Transfer' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('Bank Transfer')}
                      >
                        <span className="method-icon">🏦</span>
                        <span>Bank Transfer</span>
                      </button>
                      <button
                        className={`method-btn ${paymentMethod === 'Wallet' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('Wallet')}
                      >
                        <span className="method-icon">💳</span>
                        <span>Wallet</span>
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn-initiate-payment"
                    onClick={() => initiatePayment(paymentMethod)}
                  >
                    {paymentMethod === 'UPI' ? '📱 Show QR Code' : '✓ Confirm & Pay'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Modal */}
          {showQRModal && selectedPayment && (
            <div className="qr-modal" onClick={() => setShowQRModal(false)}>
              <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setShowQRModal(false)}>
                  ✕
                </button>

                <div className="qr-payment-section">
                  <h2>Scan & Pay</h2>
                  <p className="qr-info">
                    Scan this QR code with any UPI app to complete payment
                  </p>

                  <PaymentQRCode
                    amount={selectedPayment.amount}
                    providerName={selectedPayment.providerName}
                    providerId={selectedPayment.providerId}
                  />

                  <div className="qr-details">
                    <p>
                      <strong>Provider:</strong> {selectedPayment.providerName}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{selectedPayment.amount.toLocaleString('en-IN')}
                    </p>
                    <p>
                      <strong>UPI ID:</strong> {selectedPayment.upiId}
                    </p>
                  </div>

                  <div className="qr-actions">
                    <button
                      className="btn-payment-success"
                      onClick={() => {
                        handlePaymentConfirmation();
                      }}
                    >
                      ✓ Payment Confirmed
                    </button>
                    <button
                      className="btn-payment-cancel"
                      onClick={() => setShowQRModal(false)}
                    >
                      Cancel
                    </button>
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

export default PaymentProcessing;
