import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await adminAPI.getBookings();
        setBookings(response.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, status);
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status } : b
      ));
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const columns = [
    { key: '_id', label: 'Booking ID', render: (row) => row._id?.slice(-8) || 'N/A' },
    { key: 'user', label: 'User', render: (row) => row.user?.name || 'N/A' },
    { key: 'service', label: 'Service', render: (row) => row.service?.name || 'N/A' },
    { key: 'provider', label: 'Provider', render: (row) => row.provider?.businessName || 'Not Assigned' },
    { key: 'bookingDate', label: 'Date', render: (row) => new Date(row.bookingDate).toLocaleDateString() },
    { key: 'bookingTime', label: 'Time' },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (row) => `₹${row.totalAmount?.toLocaleString('en-IN') || 0}`
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (row) => row.paymentMethod?.toUpperCase() || row.paymentDetails?.paymentMethod?.toUpperCase() || 'COD'
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (row) => (
        <span className={`status-badge status-${row.paymentStatus || 'pending'}`}>
          {row.paymentStatus || 'pending'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`status-badge status-${row.status || 'pending'}`}>
          {row.status || 'pending'}
        </span>
      )
    },
    {
      key: 'workProof',
      label: 'Work Proof',
      render: (row) => row.workProof?.image || row.workProof?.description ? (
        <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Uploaded</span>
      ) : (
        <span style={{ color: '#999' }}>Pending</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => handleViewDetails(row)}
        >
          View Details
        </button>
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
    <React.Fragment>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="page-content">
            <DataTable
              data={bookings}
              columns={columns}
              title="Manage Bookings"
              searchFields={['user', 'provider', 'service']}
              filterFields={{
                status: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'],
                paymentStatus: ['pending', 'paid', 'refunded'],
                paymentMethod: ['card', 'upi', 'cod']
              }}
              pageSize={15}
            />
          </div>
        </div>
      </div>

      {selectedBooking && (
        <div className="dialog-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="dialog dialog-lg" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Booking Details</h3>
              <button className="dialog-close" onClick={() => setSelectedBooking(null)}>X</button>
            </div>
            <div className="dialog-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Customer Details</h4>
                  <p style={{ margin: '4px 0' }}><strong>Name:</strong> {selectedBooking.customerDetails?.name || selectedBooking.user?.name || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {selectedBooking.customerDetails?.phone || selectedBooking.user?.phone || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Email:</strong> {selectedBooking.user?.email || 'N/A'}</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Provider Details</h4>
                  <p style={{ margin: '4px 0' }}><strong>Name:</strong> {selectedBooking.provider?.businessName || 'Not Assigned'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {selectedBooking.provider?.phone || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Email:</strong> {selectedBooking.provider?.email || 'N/A'}</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Service Details</h4>
                  <p style={{ margin: '4px 0' }}><strong>Service:</strong> {selectedBooking.service?.name || 'N/A'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Price:</strong> ₹{selectedBooking.service?.price || selectedBooking.totalAmount || 0}</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Schedule</h4>
                  <p style={{ margin: '4px 0' }}><strong>Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                  <p style={{ margin: '4px 0' }}><strong>Time:</strong> {selectedBooking.bookingTime || 'Not Set'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Status:</strong> {selectedBooking.status}</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Payment Details</h4>
                  <p style={{ margin: '4px 0' }}><strong>Method:</strong> {selectedBooking.paymentMethod?.toUpperCase() || 'COD'}</p>
                  <p style={{ margin: '4px 0' }}><strong>Status:</strong> {selectedBooking.paymentStatus}</p>
                  <p style={{ margin: '4px 0' }}><strong>Amount:</strong> ₹{selectedBooking.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Work Proof</h4>
                  {selectedBooking.workProof?.image || selectedBooking.workProof?.description ? (
                    <p style={{ margin: '4px 0', color: '#10b981' }}>Uploaded</p>
                  ) : (
                    <p style={{ margin: '4px 0', color: '#999' }}>Pending</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Bookings;
