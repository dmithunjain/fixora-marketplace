import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import { adminAPI } from '../services/adminApi';
import axios from 'axios';
import '../styles/components.css';
import './ServiceApprovals.css';

const ServiceApprovals = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedService, setSelectedService] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [filter]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'all') {
        response = await adminAPI.getAllServices();
      } else {
        response = await adminAPI.getAllServices(filter);
      }
      const list = Array.isArray(response?.data) ? response.data : [];
      setServices(list);
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleApprove = async (serviceId) => {
    try {
      await adminAPI.approveService(serviceId);
      setServices(services.filter(s => s._id !== serviceId));
      alert('Service approved successfully');
    } catch (err) {
      console.error('Error approving service:', err);
      alert('Failed to approve service');
    }
  };

  const handleReject = async (serviceId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminAPI.rejectService(serviceId, reason);
      setServices(services.filter(s => s._id !== serviceId));
      alert('Service rejected');
    } catch (err) {
      console.error('Error rejecting service:', err);
      alert('Failed to reject service');
    }
  };

  const handleRemove = async (serviceId) => {
    const confirmed = window.confirm('Permanently remove this service? This cannot be undone.');
    if (!confirmed) return;

    try {
      await adminAPI.removeService(serviceId);
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
      alert('Service removed successfully');
    } catch (err) {
      console.error('Error removing service:', err);
      alert('Failed to remove service');
    }
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setEditForm({
      title: service.title || '',
      description: service.description || '',
      price: service.price || 0,
      originalPrice: service.originalPrice || 0,
      discount: service.discount || 0,
      categoryId: service.categoryId || '',
      subCategoryId: service.subCategoryId || '',
      duration: service.duration || '',
      availability: service.availability || '',
      highlights: service.highlights?.join(', ') || ''
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updateData = {
        ...editForm,
        highlights: editForm.highlights ? editForm.highlights.split(',').map(h => h.trim()).filter(h => h) : []
      };
      await adminAPI.editService(selectedService._id, updateData);
      setEditModalOpen(false);
      fetchServices();
      alert('Service updated successfully');
    } catch (err) {
      console.error('Error editing service:', err);
      alert('Failed to update service');
    }
  };

  const getCategoryName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat?.name || slug || 'N/A';
  };

  const getProviderName = (row) => {
    if (!row?.provider) return 'N/A';
    if (typeof row.provider === 'string') return row.provider;
    return row.provider.businessName || row.provider.fullName || row.provider.name || row.provider.email || 'N/A';
  };

  const getServiceDate = (row) => {
    const raw = row?.createdAt || row?.approvedAt || null;
    if (!raw) return null;
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  const categoryOptions = useMemo(() => {
    const set = new Set();
    services.forEach((s) => {
      if (s.categoryId) set.add(s.categoryId);
      else if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    const now = new Date();
    const userQuery = userFilter.trim().toLowerCase();

    return services.filter((row) => {
      const providerName = getProviderName(row).toLowerCase();
      const categoryId = row.categoryId || row.category || '';
      const serviceDate = getServiceDate(row);

      const matchesUser = !userQuery || providerName.includes(userQuery);
      const matchesCategory = categoryFilter === 'all' || categoryId === categoryFilter;

      let matchesTime = true;
      if (timeFilter !== 'all') {
        if (!serviceDate) {
          matchesTime = false;
        } else if (timeFilter === 'today') {
          matchesTime = serviceDate.toDateString() === now.toDateString();
        } else if (timeFilter === '7d') {
          const cutoff = new Date(now);
          cutoff.setDate(now.getDate() - 7);
          matchesTime = serviceDate >= cutoff;
        } else if (timeFilter === '30d') {
          const cutoff = new Date(now);
          cutoff.setDate(now.getDate() - 30);
          matchesTime = serviceDate >= cutoff;
        } else if (timeFilter === 'custom') {
          const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
          const to = toDate ? new Date(`${toDate}T23:59:59`) : null;
          if (from && serviceDate < from) matchesTime = false;
          if (to && serviceDate > to) matchesTime = false;
        }
      }

      return matchesUser && matchesCategory && matchesTime;
    });
  }, [services, userFilter, categoryFilter, timeFilter, fromDate, toDate]);

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishSlug, setPublishSlug] = useState("");

  const openPublishModal = (service) => {
    setSelectedService(service);
    setPublishSlug(service.slug || '');
    setPublishModalOpen(true);
  };

  const handlePublish = async () => {
    if (!publishSlug.trim()) {
      alert('Please enter a URL slug');
      return;
    }
    try {
      await adminAPI.editService(selectedService._id, { 
        slug: publishSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        isAvailable: true,
        isApproved: true
      });
      setPublishModalOpen(false);
      fetchServices();
      alert('Service published successfully!');
    } catch (err) {
      console.error('Error publishing service:', err);
      alert('Failed to publish service');
    }
  };

  const columns = [
    { key: '_id', label: 'ID', render: (row) => row._id?.slice(-8) || 'N/A' },
    { key: 'title', label: 'Service Title' },
    { key: 'provider', label: 'Provider', render: (row) => getProviderName(row) },
    { key: 'slug', label: 'URL Slug', render: (row) => row.slug || 'Not set' },
    { key: 'categoryId', label: 'Category', render: (row) => getCategoryName(row.categoryId) },
    { key: 'createdAt', label: 'Submitted', render: (row) => getServiceDate(row)?.toLocaleDateString() || 'N/A' },
    { key: 'price', label: 'Price', render: (row) => `₹${row.price || 0}` },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`status-badge status-${row.deleteRequested ? 'rejected' : row.isApproved ? 'approved' : row.isAvailable ? 'published' : 'pending'}`}>
          {row.deleteRequested ? 'Delete Requested' : row.isAvailable ? 'Published' : row.isApproved ? 'Approved' : 'Pending'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-edit" onClick={() => openEditModal(row)}>Edit</button>
          {!row.isAvailable && (
            <button className="btn-publish" onClick={() => openPublishModal(row)}>Publish</button>
          )}
          {!row.isApproved && (
            <>
              <button className="btn-approve" onClick={() => handleApprove(row._id)}>Approve</button>
              <button className="btn-reject" onClick={() => handleReject(row._id)}>Reject</button>
            </>
          )}
          {row.deleteRequested && (
            <button className="btn-reject" onClick={() => handleRemove(row._id)}>Remove</button>
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
          <div className="approvals-header">
            <div>
              <h2>Service Approvals</h2>
              <p>Review and approve service submissions from providers</p>
            </div>
            <div className="filter-buttons">
              <button 
                className={filter === 'pending' ? 'active' : ''} 
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={filter === 'approved' ? 'active' : ''} 
                onClick={() => setFilter('approved')}
              >
                Approved
              </button>
              <button 
                className={filter === 'rejected' ? 'active' : ''} 
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All
              </button>
            </div>
          </div>

          <div className="approval-advanced-filters">
            <input
              type="text"
              className="filter-input"
              placeholder="Filter by provider name"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />

            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{getCategoryName(cat)}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">Any Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {timeFilter === 'custom' && (
              <>
                <input
                  type="date"
                  className="filter-input"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="filter-input"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </>
            )}

            <div className="filter-count">{filteredServices.length} services</div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable
              data={filteredServices}
              columns={columns}
              title="Service Approvals"
              searchFields={['title', 'categoryId']}
              pageSize={15}
            />
          )}
        </div>
      </div>

      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Service</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editForm.categoryId}
                  onChange={e => setEditForm({...editForm, categoryId: e.target.value})}
                  className="form-select"
                >
                  <option value="">Select category</option>
                  {categories.filter(c => !c.parentId).map(cat => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={e => setEditForm({...editForm, price: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  value={editForm.originalPrice}
                  onChange={e => setEditForm({...editForm, originalPrice: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  value={editForm.discount}
                  onChange={e => setEditForm({...editForm, discount: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={editForm.duration}
                  onChange={e => setEditForm({...editForm, duration: e.target.value})}
                  className="form-input"
                  placeholder="e.g., 1 hour"
                />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <input
                  type="text"
                  value={editForm.availability}
                  onChange={e => setEditForm({...editForm, availability: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Mon-Sat"
                />
              </div>
              <div className="form-group">
                <label>Highlights (comma separated)</label>
                <input
                  type="text"
                  value={editForm.highlights}
                  onChange={e => setEditForm({...editForm, highlights: e.target.value})}
                  className="form-input"
                  placeholder="Trained Professionals, Quality Guaranteed"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({...editForm, description: e.target.value})}
                className="form-textarea"
                rows={4}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {publishModalOpen && (
        <div className="modal-overlay" onClick={() => setPublishModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Publish Service</h3>
            <p style={{ marginBottom: '15px', color: '#666' }}>
              Enter a URL slug for this service. After publishing, it will be accessible at:
              <br />
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                yourdomain.com/service/{publishSlug || 'slug'}
              </code>
            </p>
            <div className="form-group">
              <label>URL Slug</label>
              <input
                type="text"
                value={publishSlug}
                onChange={e => setPublishSlug(e.target.value)}
                className="form-input"
                placeholder="e.g., home-deep-cleaning"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setPublishModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePublish}>Publish Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceApprovals;
