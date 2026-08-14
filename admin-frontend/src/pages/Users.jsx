import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAPI.getUsers();
        setUsers(response.data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { key: '_id', label: 'User ID', render: (row) => row._id?.slice(-8) || 'N/A' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge status-${row.isBlocked ? 'blocked' : 'active'}`}>
          {row.isBlocked ? 'Blocked' : 'Active'}
        </span>
      )
    },
    { key: 'createdAt', label: 'Joined Date', render: (row) => new Date(row.createdAt).toLocaleDateString() }
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
            data={users}
            columns={columns}
            title="Manage Users"
            searchFields={['name', 'email', 'phone']}
            filterFields={{
              role: ['user', 'provider', 'admin']
            }}
            pageSize={15}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;
