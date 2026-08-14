import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import { paymentAPI } from '../services/paymentAPI';
import '../styles/provider-payments.css';

const PaymentHistory = () => {
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment history on mount
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentAPI.getPaymentHistory();
      setPaymentRecords(data || []);
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = paymentRecords.length;
    const successful = paymentRecords.filter(p => p.paymentStatus === 'completed').length;
    const failed = paymentRecords.filter(p => p.paymentStatus === 'failed').length;
    const totalAmount = paymentRecords
      .filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + (p.netAmount || 0), 0);

    return { total, successful, failed, totalAmount };
  }, [paymentRecords]);

  const columns = [
    { key: 'paymentId', label: 'Payment ID' },
    { key: 'providerName', label: 'Provider Name' },
    { key: 'serviceName', label: 'Service' },
    {
      key: 'netAmount',
      label: 'Net Amount',
      render: (row) => `₹${(row.netAmount || 0).toLocaleString('en-IN')}`
    },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'paymentDate', label: 'Payment Date' },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge status-${(row.paymentStatus || 'pending').toLowerCase()}`}>
          {(row.paymentStatus || 'pending').charAt(0).toUpperCase() + (row.paymentStatus || 'pending').slice(1)}
        </span>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-receipt" title="Download Receipt">
            📄
          </button>
          {row.paymentStatus === 'failed' && (
            <button className="btn-retry" title="Retry Payment">
              🔄
            </button>
          )}
        </div>
      )
    }
  ];

  const serviceTypes = [...new Set(paymentRecords.map(p => p.serviceName))];
  const paymentMethods = [...new Set(paymentRecords.map(p => p.paymentMethod))];
  const statuses = [...new Set(paymentRecords.map(p => p.paymentStatus))];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Payment History</h1>
            <p>View and manage all completed provider payments</p>
          </div>

          {loading ? (
            <div className="loading">Loading payment history...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <>
              {/* Payment Statistics */}
              <div className="history-stats">
                <div className="stat-card stat-card-success">
                  <div className="stat-icon">✓</div>
                  <div className="stat-content">
                    <h4>Successful Payments</h4>
                    <p className="stat-value">{stats.successful}</p>
                    <small>₹{stats.totalAmount.toLocaleString('en-IN')}</small>
                  </div>
                </div>

                <div className="stat-card stat-card-danger">
                  <div className="stat-icon">✕</div>
                  <div className="stat-content">
                    <h4>Failed Payments</h4>
                    <p className="stat-value">{stats.failed}</p>
                    <small>Requires action</small>
                  </div>
                </div>

                <div className="stat-card stat-card-info">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <h4>Total Transactions</h4>
                    <p className="stat-value">{stats.total}</p>
                    <small>All time</small>
                  </div>
                </div>

                <div className="stat-card stat-card-primary">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <h4>Average Payment</h4>
                    <p className="stat-value">
                      ₹{Math.round(stats.totalAmount / (stats.successful || 1)).toLocaleString('en-IN')}
                    </p>
                    <small>Per transaction</small>
                  </div>
                </div>
              </div>

              {/* Payment Details Table */}
              <DataTable
                data={paymentRecords}
                columns={columns}
                title="Payment Transactions"
                searchFields={['providerName', 'bookingId', 'transactionId', 'serviceName']}
                filterFields={{
                  serviceName: serviceTypes,
                  paymentMethod: paymentMethods,
                  paymentStatus: statuses
                }}
                pageSize={15}
              />

              {/* Payment Summary */}
              <div className="payment-summary-section">
                <h2>Payment Summary</h2>
                <div className="summary-grid">
                  <div className="summary-card">
                    <h4>Payment Methods</h4>
                    <div className="summary-content">
                      {paymentMethods.map(method => {
                        const count = paymentRecords.filter(p => p.paymentMethod === method).length;
                        const amount = paymentRecords
                          .filter(p => p.paymentMethod === method)
                          .reduce((sum, p) => sum + (p.netAmount || 0), 0);
                        return (
                          <div key={method} className="summary-item">
                            <span>{method}</span>
                            <span>
                              {count} payments • ₹{amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="summary-card">
                    <h4>Top Service Types</h4>
                    <div className="summary-content">
                      {serviceTypes
                        .map(service => ({
                          service,
                          count: paymentRecords.filter(p => p.serviceName === service).length,
                          amount: paymentRecords
                            .filter(p => p.serviceName === service)
                            .reduce((sum, p) => sum + (p.netAmount || 0), 0)
                        }))
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map(item => (
                          <div key={item.service} className="summary-item">
                            <span>{item.service}</span>
                            <span>
                              {item.count} payments • ₹{item.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
