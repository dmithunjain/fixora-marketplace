import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerServiceAPI, reviewAPI } from "../../services/api";
import "./ProviderPanel.css";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export default function MyServices() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [providerData, setProviderData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [serviceRatings, setServiceRatings] = useState({});

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadServices();
  }, [navigate]);

  const loadServices = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
      setProviderData(stored);
      
      const res = await providerServiceAPI.getMyServices();
      const payload = res?.data || res;
      const servicesArray = Array.isArray(payload) ? payload : (Array.isArray(payload?.services) ? payload.services : []);
      setServices(servicesArray);

      const ratings = {};
      for (const service of servicesArray) {
        try {
          const reviewRes = await reviewAPI.getServiceReviews(service._id || service.id);
          const reviews = reviewRes?.data?.reviews || reviewRes?.data || [];
          const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
            : 0;
          ratings[service._id || service.id] = { 
            avg: avgRating.toFixed(1), 
            count: reviews.length 
          };
        } catch (e) {
          ratings[service._id || service.id] = { avg: 0, count: 0 };
        }
      }
      setServiceRatings(ratings);
    } catch (err) {
      console.log("Service fetch error:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }
    
    try {
      await providerServiceAPI.deleteService(serviceId);
      setServices(prev => prev.map((s) => (
        s._id === serviceId ? { ...s, deleteRequested: true, isAvailable: false } : s
      )));
      setMessage({ type: "success", text: "Removal request sent to admin." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete service" });
    }
  };

  const categories = useMemo(() => {
    const unique = new Set(
      services
        .map((s) => s.categoryId || s.category)
        .filter(Boolean)
    );
    return Array.from(unique);
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      const serviceStatus = service.deleteRequested ? "remove-requested" : (service.status || "pending");
      const serviceCategory = service.categoryId || service.category || "";
      const matchesStatus = statusFilter === "all" || serviceStatus === statusFilter;
      const matchesCategory = categoryFilter === "all" || serviceCategory === categoryFilter;
      const matchesSearch =
        query.length === 0 ||
        String(service.title || service.name || "").toLowerCase().includes(query) ||
        String(service.description || "").toLowerCase().includes(query) ||
        String(serviceCategory).toLowerCase().includes(query);

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [services, searchTerm, statusFilter, categoryFilter]);

  if (loading) {
    return (
      <div className="provider-layout">
        <ProviderSidebar providerData={null} />
        <main className="provider-main">
          <div className="provider-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { class: "badge-success", label: "Approved" },
      rejected: { class: "badge-danger", label: "Rejected" },
      pending: { class: "badge-warning", label: "Pending" }
    };
    const info = statusMap[status] || statusMap.pending;
    return <span className={`badge ${info.class}`}>{info.label}</span>;
  };

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="page-title">My Services</h1>
              <p className="page-subtitle">Manage your service listings</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/provider/add-service")}>
              <PlusIcon />
              Add Service
            </button>
          </div>

          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
              {message.text}
            </div>
          )}

          {/* Filters Section */}
          {services.length > 0 && (
            <div className="my-services-filters">
              <div className="filter-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="remove-requested">Removal Requested</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="filter-results">
                {filteredServices.length} of {services.length} services
              </div>
            </div>
          )}

          {services.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <ImageIcon />
                <h3>No services yet</h3>
                <p>Create your first service to start receiving bookings</p>
                <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate("/provider/add-service")}>
                  <PlusIcon />
                  Add Your First Service
                </button>
              </div>
            </div>
          ) : (
            <div className="my-services-container">
              {filteredServices.map((service) => {
                const rating = serviceRatings[service._id] || serviceRatings[service.id] || { avg: 0, count: 0 };
                return (
                  <div key={service._id} className="my-service-row">
                    <div className="my-service-image">
                      {service.images?.[0] || service.image ? (
                        <img src={service.images?.[0] || service.image} alt={service.title || "Service"} />
                      ) : (
                        <div className="my-service-image-placeholder"><ImageIcon /></div>
                      )}
                    </div>
                    <div className="my-service-info">
                      <div className="my-service-header">
                        <h3 className="my-service-title">{service.title || "Untitled Service"}</h3>
                        <div className="my-service-badges">
                          {service.deleteRequested ? (
                            <span className="badge badge-warning">Removal Requested</span>
                          ) : getStatusBadge(service.status)}
                        </div>
                      </div>
                      <p className="my-service-category">{service.category || "Not specified"}</p>
                      <div className="my-service-meta">
                        <span className="my-service-price">₹{service.price?.toLocaleString() || "0"}</span>
                        {rating.count > 0 && (
                          <span className="my-service-rating">
                            <span className="rating-star">★</span>
                            <span className="rating-value">{rating.avg}</span>
                            <span className="rating-count">({rating.count} reviews)</span>
                          </span>
                        )}
                        {rating.count === 0 && (
                          <span className="my-service-rating no-rating">No reviews yet</span>
                        )}
                      </div>
                    </div>
                    <div className="my-service-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/provider/my-services/${service._id}/edit`)} disabled={service.deleteRequested}>
                        <EditIcon /> Edit
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(service._id)} disabled={service.deleteRequested}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {services.length > 0 && filteredServices.length === 0 && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="empty-state">
                <h3>No matching services</h3>
                <p>Try changing search text or filter options.</p>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}