import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import axios from 'axios';
import '../styles/components.css';
import './ServiceApprovals.css';

const placementCategories = [
  { id: 'home-cleaning', label: 'Cleaning' },
  { id: 'ac-repair', label: 'AC Service' },
  { id: 'appliance-repair', label: 'Appliances' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'salon-spa', label: 'Salon & Beauty' },
  { id: 'painting', label: 'Painting' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'pest-control', label: 'Pest Control' },
  { id: 'carpenter', label: 'Carpenter' },
  { id: 'gardening', label: 'Gardening' }
];

const ServicePlacement = () => {
  const [placements, setPlacements] = useState([]);
  const [approvedServices, setApprovedServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlacement, setEditPlacement] = useState(null);
  const [tableCategoryFilter, setTableCategoryFilter] = useState('all');
  const [tableSearch, setTableSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [formData, setFormData] = useState({
    serviceId: '',
    targetPageId: '',
    categoryId: '',
    subCategoryId: '',
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [placementsRes, servicesRes, categoriesRes] = await Promise.all([
        adminAPI.getServicePlacements(),
        adminAPI.getAllServices(),
        axios.get('http://localhost:5000/api/categories')
      ]);
      
      setPlacements(placementsRes.data || placementsRes || []);
      setApprovedServices((servicesRes.data || servicesRes || []).filter(s => s.isApproved));
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPlacement) {
        await adminAPI.updateServicePlacement(editPlacement._id, formData);
        alert('Placement updated successfully');
      } else {
        await adminAPI.createServicePlacement(formData);
        alert('Service placed successfully');
      }
      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving placement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this placement?')) return;
    try {
      await adminAPI.deleteServicePlacement(id);
      alert('Placement deleted');
      fetchData();
    } catch (err) {
      alert('Error deleting placement');
    }
  };

  const openModal = (placement = null) => {
    setServiceSearch('');
    if (placement) {
      setEditPlacement(placement);
      setFormData({
        serviceId: placement.serviceId?._id || placement.serviceId,
        targetPageId: placement.targetPageId,
        categoryId: placement.categoryId || '',
        subCategoryId: placement.subCategoryId || '',
        displayOrder: placement.displayOrder || 0,
        isActive: placement.isActive !== false
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditPlacement(null);
    setServiceSearch('');
    setFormData({
      serviceId: '',
      targetPageId: '',
      categoryId: '',
      subCategoryId: '',
      displayOrder: 0,
      isActive: true
    });
  };

  const getServiceName = (serviceId) => {
    const service = approvedServices.find(s => s._id === serviceId?._id || s._id === serviceId);
    return service?.title || service?.name || 'Unknown Service';
  };

  const getServiceById = (serviceId) =>
    approvedServices.find(s => s._id === serviceId?._id || s._id === serviceId);

  const getServiceCategoryId = (service) => service?.categoryId || service?.category || '';

  const getPlacementCategoryName = (categoryId) => {
    const fixed = placementCategories.find(c => c.id === categoryId);
    if (fixed) return fixed.label;

    const cat = categories.find(c => c._id === categoryId || c.slug === categoryId);
    return cat?.name || categoryId || '-';
  };

  const columns = [
    { key: 'targetPageId', label: 'Page ID', render: (row) => (
      <span style={{ fontWeight: 600, color: '#4f46e5' }}>/services/page/{row.targetPageId}</span>
    )},
    { key: 'serviceId', label: 'Service', render: (row) => getServiceName(row.serviceId) },
    { key: 'categoryId', label: 'Category', render: (row) => getPlacementCategoryName(row.categoryId) },
    { key: 'displayOrder', label: 'Order' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (row) => (
        <span className={`status-badge ${row.isActive ? 'status-approved' : 'status-rejected'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-edit" onClick={() => openModal(row)}>Edit</button>
          <button className="btn-reject" onClick={() => handleDelete(row._id)}>Delete</button>
        </div>
      )
    }
  ];

  const placedServiceIds = useMemo(() => {
    const set = new Set();
    placements.forEach((p) => {
      const id = p?.serviceId?._id || p?.serviceId;
      if (id) set.add(id);
    });
    return set;
  }, [placements]);

  const filteredPlacements = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    return placements.filter((p) => {
      const cat = p.categoryId || '';
      const name = getServiceName(p.serviceId).toLowerCase();
      const page = String(p.targetPageId || '');
      const matchesCategory = tableCategoryFilter === 'all' || cat === tableCategoryFilter;
      const matchesSearch = !q || name.includes(q) || page.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [placements, tableCategoryFilter, tableSearch, approvedServices]);

  const groupedExistingPlacements = useMemo(() => {
    const groups = placementCategories.map((cat) => ({ ...cat, items: [] }));
    const byId = Object.fromEntries(groups.map((g) => [g.id, g]));
    placements.forEach((p) => {
      const cat = p.categoryId || getServiceCategoryId(getServiceById(p.serviceId));
      if (!byId[cat]) return;
      byId[cat].items.push(p);
    });
    return groups;
  }, [placements, approvedServices]);

  const serviceOptions = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();
    return approvedServices.filter((service) => {
      const serviceCategory = getServiceCategoryId(service);
      const matchesCategory = !formData.categoryId || serviceCategory === formData.categoryId;
      const serviceId = service._id;
      const isUsed = placedServiceIds.has(serviceId);
      const isCurrent = editPlacement && String(formData.serviceId) === String(serviceId);
      const matchesPlaced = !isUsed || isCurrent;
      const label = `${service.title || service.name || ''} ${serviceCategory}`.toLowerCase();
      const matchesSearch = !q || label.includes(q);
      return matchesCategory && matchesPlaced && matchesSearch;
    });
  }, [approvedServices, formData.categoryId, formData.serviceId, serviceSearch, placedServiceIds, editPlacement]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="approvals-header">
            <div>
              <h2>Service Placement</h2>
              <p>Assign approved services to public page IDs</p>
            </div>
            <button className="btn btn-primary" onClick={() => openModal()}>
              + Add Placement
            </button>
          </div>

          <div className="placement-toolbar">
            <select
              className="filter-select"
              value={tableCategoryFilter}
              onChange={(e) => setTableCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {placementCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <input
              className="filter-input"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search by service name or page ID"
            />
            <div className="filter-count">{filteredPlacements.length} placements</div>
          </div>

          <div className="placement-summary-grid">
            {groupedExistingPlacements.map((group) => (
              <div key={group.id} className="placement-summary-card">
                <div className="placement-summary-head">
                  <strong>{group.label}</strong>
                  <span>{group.items.length}</span>
                </div>
                <div className="placement-summary-list">
                  {group.items.length === 0 ? (
                    <small>None added yet</small>
                  ) : (
                    group.items.slice(0, 4).map((item) => (
                      <small key={item._id}>#{item.targetPageId} - {getServiceName(item.serviceId)}</small>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Page ID</th>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlacements.map((placement) => (
                    <tr key={placement._id}>
                      <td><span style={{ fontWeight: 600, color: '#4f46e5' }}>/services/page/{placement.targetPageId}</span></td>
                      <td>{getServiceName(placement.serviceId)}</td>
                      <td>{getPlacementCategoryName(placement.categoryId)}</td>
                      <td>{placement.displayOrder}</td>
                      <td>
                        <span className={`status-badge ${placement.isActive ? 'status-approved' : 'status-rejected'}`}>
                          {placement.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => openModal(placement)}>Edit</button>
                          <button className="btn-reject" onClick={() => handleDelete(placement._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPlacements.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        No matching placements. Adjust filters or add a placement.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editPlacement ? 'Edit Placement' : 'Add Service Placement'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Placement Category *</label>
                <select
                  className="form-select"
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value, serviceId: ''})}
                  required
                >
                  <option value="">Select category</option>
                  {placementCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Search Service</label>
                <input
                  type="text"
                  className="form-input"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Type service name"
                />
              </div>

              <div className="form-group">
                <label>Select Approved Service *</label>
                <select
                  className="form-select"
                  value={formData.serviceId}
                  onChange={e => setFormData({...formData, serviceId: e.target.value})}
                  required
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map(service => (
                    <option key={service._id} value={service._id}>
                      {service.title || service.name} - ₹{service.price} ({getPlacementCategoryName(getServiceCategoryId(service))})
                    </option>
                  ))}
                </select>
                <small style={{ color: '#666' }}>
                  Showing unplaced approved services{formData.categoryId ? ` in ${getPlacementCategoryName(formData.categoryId)}` : ''}.
                </small>
              </div>
              
              <div className="form-group">
                <label>Target Page ID *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.targetPageId}
                  onChange={e => setFormData({...formData, targetPageId: e.target.value})}
                  placeholder="e.g., 6, 7, 8"
                  required
                />
                <small style={{ color: '#666' }}>Service will be accessible at /services/page/{formData.targetPageId || 'ID'}</small>
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.displayOrder}
                  onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  {' '}Active
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editPlacement ? 'Update' : 'Create'} Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePlacement;
