import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import '../styles/components.css';
import './PaymentVerifications.css';

const PaymentVerifications = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      const endpoint = filter === 'all' 
        ? 'http://localhost:5000/api/payments/admin/all'
        : `http://localhost:5000/api/payments/admin/all?status=${filter}`;
      
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId) => {
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      const response = await fetch(`http://localhost:5000/api/payments/admin/verify/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approve' })
      });
      
      if (response.ok) {
        alert('Payment verified successfully!');
        fetchPayments();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to verify payment');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      alert('Failed to verify payment');
    }
  };

  const handleRejectClick = (payment) => {
    setSelectedPayment(payment);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason) {
      alert('Please enter a reason for rejection');
      return;
    }

    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      const response = await fetch(`http://localhost:5000/api/payments/admin/verify/${selectedPayment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'reject', notes: rejectReason })
      });
      
      if (response.ok) {
        alert('Payment rejected!');
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedPayment(null);
        fetchPayments();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject payment');
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
      alert('Failed to reject payment');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#fff3e0', color: '#e65100' },
      paid: { bg: '#e3f2fd', color: '#1565c0' },
      verified: { bg: '#e8f5e9', color: '#2e7d32' },
      failed: { bg: '#ffebee', color: '#c62828' },
      expired: { bg: '#f5f5f5', color: '#616161' }
    };
    return (
      <span className="status-badge" style={{ 
        backgroundColor: colors[status]?.bg || '#f5f5f5',
        color: colors[status]?.color || '#616161'
      }}>
        {status?.toUpperCase()}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const labels = {
      upi: 'UPI',
      card: 'Card',
      cod: 'COD'
    };
    return (
      <span style={{ 
        backgroundColor: '#f0f0f0',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {labels[method] || method}
      </span>
    );
  };

  const columns = [
    { key: '_id', label: 'ID', render: (row) => row._id?.slice(-8) || 'N/A' },
    { key: 'userId', label: 'User', render: (row) => row.userId?.name || row.userId?.email || 'N/A' },
    { key: 'serviceId', label: 'Service', render: (row) => row.serviceId?.title || 'N/A' },
    { key: 'providerId', label: 'Provider', render: (row) => row.providerId?.businessName || 'N/A' },
    { key: 'amount', label: 'Amount', render: (row) => `₹${row.amount}` },
    { key: 'paymentMethod', label: 'Method', render: (row) => getMethodBadge(row.paymentMethod) },
    { key: 'transactionId', label: 'Transaction ID', render: (row) => row.transactionId?.substring(0, 20) || 'N/A' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    { key: 'createdAt', label: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          {row.status === 'paid' && (
            <>
              <button 
                className="btn-approve" 
                onClick={() => handleVerify(row._id)}
              >
                Verify
              </button>
              <button 
                className="btn-reject" 
                onClick={() => handleRejectClick(row)}
              >
                Reject
              </button>
            </>
          )}
          {row.status === 'verified' && (
            <span style={{ color: 'green', fontWeight: '600' }}>✓ Verified</span>
          )}
          {row.status === 'failed' && (
            <span style={{ color: 'red', fontWeight: '600' }}>✗ Rejected</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="payments-header">
            <div>
              <h2>Payment Verifications</h2>
              <p>Verify and manage payment transactions on the platform</p>
            </div>
            <div className="filter-buttons">
              <button 
                className={filter === 'pending' ? 'active' : ''} 
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={filter === 'paid' ? 'active' : ''} 
                onClick={() => setFilter('paid')}
              >
                Paid (Awaiting Verify)
              </button>
              <button 
                className={filter === 'verified' ? 'active' : ''} 
                onClick={() => setFilter('verified')}
              >
                Verified
              </button>
              <button 
                className={filter === 'failed' ? 'active' : ''} 
                onClick={() => setFilter('failed')}
              >
                Failed
              </button>
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable
              data={payments}
              columns={columns}
              title="Payment Verifications"
              searchFields={['userId.name', 'serviceId.title', 'transactionId']}
              pageSize={15}
            />
          )}

          {/* Reject Dialog */}
          {rejectDialogOpen && (
            <div className="dialog-overlay">
              <div className="dialog-content">
                <h3>Reject Payment</h3>
                <p>
                  Are you sure you want to reject this payment of ₹{selectedPayment?.amount}?
                </p>
                <textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="dialog-actions">
                  <button 
                    className="btn-cancel"
                    onClick={() => {
                      setRejectDialogOpen(false);
                      setRejectReason('');
                      setSelectedPayment(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-confirm-reject"
                    onClick={handleRejectConfirm}
                  >
                    Reject Payment
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

export default PaymentVerifications;
