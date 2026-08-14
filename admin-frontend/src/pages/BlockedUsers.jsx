import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import users from '../data/users';
import '../styles/components.css';

const BlockedUsers = () => {
  // Filter only blocked users
  const blockedUsers = users.filter(user => user.status === 'blocked');

  const columns = [
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'role', label: 'Role' },
    { key: 'joinedDate', label: 'Joined Date' },
    { key: 'bookings', label: 'Bookings' },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-unblock">Unblock</button>
          <button className="btn-delete">Delete</button>
        </div>
      )
    }
  ];

  const roles = [...new Set(blockedUsers.map(u => u.role))];
  const cities = [...new Set(blockedUsers.map(u => u.city))];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="blocked-users-header">
            <h2>Blocked Users Management</h2>
            <div className="info-box">
              <p>Total Blocked Users: <strong>{blockedUsers.length}</strong></p>
            </div>
          </div>

          <DataTable
            data={blockedUsers}
            columns={columns}
            title="Blocked Users"
            searchFields={['name', 'email', 'phone', 'city']}
            filterFields={{
              role: roles,
              city: cities
            }}
            pageSize={15}
          />
        </div>
      </div>
    </div>
  );
};

export default BlockedUsers;
