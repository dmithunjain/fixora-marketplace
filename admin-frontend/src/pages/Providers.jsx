import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await adminAPI.getProviders();
        setProviders(response.data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const handleVerify = async (providerId, status) => {
    try {
      await adminAPI.verifyProvider(providerId, status);
      setProviders(providers.map(p => 
        p._id === providerId ? { ...p, verificationStatus: status } : p
      ));
    } catch (err) {
      console.error('Error verifying provider:', err);
    }
  };

  const columns = [
    { key: '_id', label: 'Provider ID', render: (row) => row._id?.slice(-8) || 'N/A' },
    {
      key: 'businessName',
      label: 'Name',
      render: (row) => (
        <div className="provider-cell">
          <div className="provider-cell-info">
            <div className="provider-name">{row.businessName}</div>
            <div className="provider-service">{row.serviceCategory}</div>
          </div>
        </div>
      )
    },
    { key: 'serviceCategory', label: 'Service' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <span className="rating-badge">⭐ {row.rating || 0} ({row.totalReviews || 0})</span>
      )
    },
    { key: 'completedJobs', label: 'Jobs Completed' },
    {
      key: 'verificationStatus',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge status-${row.verificationStatus || 'pending'}`}>
          {row.verificationStatus || 'pending'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          {row.verificationStatus === 'pending' && (
            <>
              <button className="btn-approve" onClick={() => handleVerify(row._id, 'approved')}>Approve</button>
              <button className="btn-reject" onClick={() => handleVerify(row._id, 'rejected')}>Reject</button>
            </>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="page-content">
            <p>Loading...</p>
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
          <DataTable
            data={providers}
            columns={columns}
            title="Manage Service Providers"
            searchFields={['businessName', 'serviceCategory']}
            filterFields={{
              verificationStatus: ['pending', 'approved', 'rejected']
            }}
            pageSize={12}
          />
        </div>
      </div>
    </div>
  );
};

export default Providers;
