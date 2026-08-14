import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import '../styles/components.css';
import './ServiceHighlights.css';

const ServiceHighlights = () => {
  const [highlights, setHighlights] = useState({});
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [highlightType, setHighlightType] = useState('featured');

  useEffect(() => {
    fetchHighlights();
    fetchAllServices();
  }, []);

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      const response = await fetch('http://localhost:5000/api/highlights/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setHighlights(data);
    } catch (err) {
      console.error('Error fetching highlights:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      const response = await fetch('http://localhost:5000/api/provider-services/public', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAllServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleAddHighlight = async () => {
    if (!selectedService) return;
    
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      await fetch('http://localhost:5000/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: selectedService,
          highlightType
        })
      });
      setShowModal(false);
      setSelectedService('');
      fetchHighlights();
    } catch (err) {
      console.error('Error adding highlight:', err);
    }
  };

  const handleRemoveHighlight = async (highlightId) => {
    if (!confirm('Are you sure you want to remove this highlight?')) return;
    
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      await fetch(`http://localhost:5000/api/highlights/${highlightId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHighlights();
    } catch (err) {
      console.error('Error removing highlight:', err);
    }
  };

  const handleAutoHighlight = async (type) => {
    if (!confirm(`Auto-populate ${type.replace('_', ' ')} based on service performance?`)) return;
    
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      const token = adminInfo ? JSON.parse(adminInfo).token : null;
      await fetch(`http://localhost:5000/api/highlights/auto/${type}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHighlights();
    } catch (err) {
      console.error('Error auto-highlighting:', err);
    }
  };

  const highlightTypes = [
    { key: 'featured', label: 'Featured', icon: '⭐' },
    { key: 'most_booked', label: 'Most Booked', icon: '🔥' },
    { key: 'top_rated', label: 'Top Rated', icon: '⭐' },
    { key: 'new_arrival', label: 'New Arrival', icon: '🆕' },
    { key: 'seasonal_offer', label: 'Seasonal Offer', icon: '🏷️' }
  ];

  const getHighlightedServices = (type) => highlights[type] || [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        
        <div className="page-content">
          <div className="highlights-header">
            <div className="highlights-header-left">
              <h1>Service Highlights</h1>
              <p>Manage featured, popular, and highlighted services on the platform</p>
            </div>
            <div className="highlights-header-right">
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Service
              </button>
            </div>
          </div>

          {loading ? (
            <div className="highlights-loading"></div>
          ) : (
            <div className="highlights-sections">
              {highlightTypes.map(type => (
                <div key={type.key} className="highlight-section">
                  <div className="section-header">
                    <h3>{type.icon} {type.label}</h3>
                    <button 
                      className="btn-auto" 
                      onClick={() => handleAutoHighlight(type.key)}
                    >
                      Auto-populate
                    </button>
                  </div>
                  <div className="highlight-cards">
                    {getHighlightedServices(type.key).length === 0 ? (
                      <p className="no-services">No services highlighted</p>
                    ) : (
                      getHighlightedServices(type.key).map(h => (
                        <div key={h._id} className="highlight-card">
                          <div className="card-content">
                            <h4>{h.service?.name || 'Service'}</h4>
                            <p>{h.service?.provider?.businessName || 'Provider'}</p>
                            <span className="rating">⭐ {h.service?.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                          <button 
                            className="btn-remove" 
                            onClick={() => handleRemoveHighlight(h._id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Add Service to Highlight</h3>
                  <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Select Highlight Type</label>
                    <select 
                      value={highlightType} 
                      onChange={(e) => setHighlightType(e.target.value)}
                    >
                      {highlightTypes.map(t => (
                        <option key={t.key} value={t.key}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Select Service</label>
                    <select 
                      value={selectedService} 
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      <option value="">Choose a service...</option>
                      {allServices.map(s => (
                        <option key={s._id} value={s._id}>{s.name} - {s.provider?.businessName}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="btn-submit" 
                    onClick={handleAddHighlight}
                    disabled={!selectedService}
                  >
                    Add to Highlight
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

export default ServiceHighlights;
