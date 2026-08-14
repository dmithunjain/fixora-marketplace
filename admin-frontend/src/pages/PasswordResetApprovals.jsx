import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const PasswordResetApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getPasswordResetRequests(filter);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching password reset requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this password reset request?')) return;
    try {
      setActionLoading(id);
      const res = await adminAPI.approvePasswordReset(id);
      alert(res.data?.message || 'Password reset approved.');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
      setActionLoading(id);
      await adminAPI.rejectPasswordReset(id, reason || 'Rejected by admin');
      alert('Password reset request rejected.');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting request');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const cls = `status-badge status-${status}`;
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h1>Password Reset Approvals</h1>
              <p>Review and approve provider password reset requests</p>
            </div>
            <div className="filters">
              {['pending', 'approved', 'rejected'].map(s => (
                <button
                  key={s}
                  className={`btn-view ${filter === s ? 'active-filter' : ''}`}
                  onClick={() => setFilter(s)}
                  style={filter === s ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : {}}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                No {filter} password reset requests found.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Provider Name</th>
                    <th>Requested At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req._id}>
                      <td>{req.email}</td>
                      <td>{req.userId?.name || '-'}</td>
                      <td>{new Date(req.requestedAt).toLocaleString()}</td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        {req.status === 'pending' && (
                          <div className="action-buttons">
                            <button
                              className="btn-approve"
                              onClick={() => handleApprove(req._id)}
                              disabled={actionLoading === req._id}
                            >
                              {actionLoading === req._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleReject(req._id)}
                              disabled={actionLoading === req._id}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {req.status === 'approved' && (
                          <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '13px' }}>
                            Approved {req.approvedAt ? `on ${new Date(req.approvedAt).toLocaleDateString()}` : ''}
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '13px' }}>
                            Rejected{req.rejectionReason ? `: ${req.rejectionReason}` : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetApprovals;
