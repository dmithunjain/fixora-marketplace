import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { adminAPI } from "../services/adminApi";
import "../styles/components.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      navigate("/");
      return;
    }
    
    fetchStats();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError("Failed to load dashboard stats");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="dashboard-content">
            <div className="dash-header">
              <div className="dash-header-left">
                <div className="dash-skeleton-title"></div>
                <div className="dash-skeleton-date"></div>
              </div>
            </div>
            <div className="dash-stats-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="dash-stat-skeleton"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="dashboard-content">
            <div className="dash-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>{error}</h3>
              <p>Please refresh the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainStats = [
    { 
      label: "Total Revenue", 
      value: `₹${((stats?.totalRevenue || 0) / 100000).toFixed(2)}L`, 
      trend: `+${stats?.monthlyGrowth || 0}%`,
      trendUp: true,
      icon: "revenue",
      color: "#059669",
      colorClass: "revenue"
    },
    { 
      label: "Active Providers", 
      value: stats?.totalProviders || 0, 
      subtext: `${stats?.pendingApprovals || 0} pending`,
      icon: "providers",
      color: "#7c3aed",
      colorClass: "providers"
    },
    { 
      label: "Total Bookings", 
      value: stats?.totalBookings || 0, 
      subtext: `${stats?.completedBookings || 0} completed`,
      icon: "bookings",
      color: "#0891b2",
      colorClass: "bookings"
    },
    { 
      label: "Active Users", 
      value: stats?.totalUsers || 0, 
      subtext: `${stats?.blockedUsers || 0} blocked`,
      icon: "users",
      color: "#0284c7",
      colorClass: "users"
    }
  ];

  const quickLinks = [
    { label: "Manage Users", path: "/admin/users", color: "users", icon: "👥" },
    { label: "All Providers", path: "/admin/providers", color: "providers", icon: "🔧" },
    { label: "View Bookings", path: "/admin/bookings", color: "bookings", icon: "📋" },
    { label: "Verifications", path: "/admin/provider-verification", color: "verification", icon: "✅" },
    { label: "Withdrawals", path: "/admin/withdrawal-approvals", color: "withdrawals", icon: "💰" },
    { label: "Support Tickets", path: "/admin/support-tickets", color: "support", icon: "🎫" },
    { label: "Analytics", path: "/admin/analytics", color: "analytics", icon: "📊" },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="dashboard-content">
          {/* Header */}
          <div className="dash-header">
            <div className="dash-header-left">
              <h1 className="dash-title">{getGreeting()}</h1>
              <p className="dash-subtitle">{formatDate(currentTime)}</p>
            </div>
            <div className="dash-header-right">
              <div className="dash-status-badge">
                <span className="dash-status-dot"></span>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="dash-stats-grid">
            {mainStats.map((stat, index) => (
              <div key={index} className={`dash-stat-card ${stat.colorClass}`}>
                <div className="dash-stat-header">
                  <div className="dash-stat-icon">
                    {stat.icon === 'revenue' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    )}
                    {stat.icon === 'providers' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                      </svg>
                    )}
                    {stat.icon === 'bookings' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    )}
                    {stat.icon === 'users' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    )}
                  </div>
                  {stat.trend && (
                    <div className={`dash-stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points={stat.trendUp ? "23 6 13.5 15.5 8.5 10.5 1 18" : "23 18 13.5 8.5 8.5 13.5 1 6"}></polyline>
                      </svg>
                      {stat.trend}
                    </div>
                  )}
                </div>
                <div className="dash-stat-value">{stat.value}</div>
                <div className="dash-stat-label">{stat.label}</div>
                {stat.subtext && <div className="dash-stat-sub">{stat.subtext}</div>}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="dash-section quick-links">
            <div className="dash-section-header">
              <div className="dash-section-indicator"></div>
              <div>
                <h2>Quick Access</h2>
                <p>Navigate to common tasks</p>
              </div>
            </div>
            <div className="dash-quick-links">
              {quickLinks.map((link, index) => (
                <button 
                  key={index} 
                  className={`dash-quick-link ${link.color}`}
                  onClick={() => navigate(link.path)}
                >
                  <span className="dash-quick-link-icon">
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="dash-two-col">
            {/* Platform Metrics */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{width: '4px', height: '16px', background: 'linear-gradient(180deg, #0891b2, #0284c7)', borderRadius: '2px'}}></div>
                  <h3>Platform Metrics</h3>
                </div>
                <span className="dash-card-badge">Live</span>
              </div>
              <div className="dash-metrics">
                <div className="dash-metric">
                  <div className="dash-metric-info">
                    <span className="dash-metric-label">Pending Approvals</span>
                    <span className="dash-metric-value">{stats?.pendingApprovals || 0}</span>
                  </div>
                  <div className="dash-metric-bar" style={{ '--fill': `${Math.min((stats?.pendingApprovals || 0) * 10, 100)}%`, '--bar-color': '#d97706' }}></div>
                </div>
                <div className="dash-metric">
                  <div className="dash-metric-info">
                    <span className="dash-metric-label">Pending Bookings</span>
                    <span className="dash-metric-value">{stats?.pendingBookings || 0}</span>
                  </div>
                  <div className="dash-metric-bar" style={{ '--fill': `${Math.min((stats?.pendingBookings || 0) * 5, 100)}%`, '--bar-color': '#0284c7' }}></div>
                </div>
                <div className="dash-metric">
                  <div className="dash-metric-info">
                    <span className="dash-metric-label">Completed Bookings</span>
                    <span className="dash-metric-value">{stats?.completedBookings || 0}</span>
                  </div>
                  <div className="dash-metric-bar" style={{ '--fill': `${stats?.totalBookings ? ((stats?.completedBookings / stats?.totalBookings) * 100) : 0}%`, '--bar-color': '#059669' }}></div>
                </div>
                <div className="dash-metric">
                  <div className="dash-metric-info">
                    <span className="dash-metric-label">Completion Rate</span>
                    <span className="dash-metric-value">
                      {stats?.totalBookings ? ((stats?.completedBookings / stats?.totalBookings) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="dash-metric-bar" style={{ '--fill': `${stats?.totalBookings ? ((stats?.completedBookings / stats?.totalBookings) * 100) : 0}%`, '--bar-color': '#4f46e5' }}></div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="dash-card">
              <div className="dash-card-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <div style={{width: '4px', height: '16px', background: 'linear-gradient(180deg, #7c3aed, #4f46e5)', borderRadius: '2px'}}></div>
                  <h3>Summary</h3>
                </div>
              </div>
              <div className="dash-summary-list">
                <div className="dash-summary-item completed" onClick={() => navigate('/admin/providers')} style={{cursor: 'pointer'}}>
                  <div className="dash-summary-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="dash-summary-content">
                    <span className="dash-summary-label">Verified Providers</span>
                    <span className="dash-summary-value">{(stats?.totalProviders || 0) - (stats?.pendingApprovals || 0)}</span>
                  </div>
                </div>
                <div className="dash-summary-item pending" onClick={() => navigate('/admin/provider-verification')} style={{cursor: 'pointer'}}>
                  <div className="dash-summary-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="dash-summary-content">
                    <span className="dash-summary-label">Pending Verification</span>
                    <span className="dash-summary-value">{stats?.pendingApprovals || 0}</span>
                  </div>
                </div>
                <div className="dash-summary-item blocked" onClick={() => navigate('/admin/blocked-users')} style={{cursor: 'pointer'}}>
                  <div className="dash-summary-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                  </div>
                  <div className="dash-summary-content">
                    <span className="dash-summary-label">Blocked Accounts</span>
                    <span className="dash-summary-value">{stats?.blockedUsers || 0}</span>
                  </div>
                </div>
                <div className="dash-summary-item payments" onClick={() => navigate('/admin/withdrawal-approvals')} style={{cursor: 'pointer'}}>
                  <div className="dash-summary-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div className="dash-summary-content">
                    <span className="dash-summary-label">Pending Payments</span>
                    <span className="dash-summary-value">{stats?.pendingPayments || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="dash-legend">
            <div className="dash-legend-title">Quick Link Colors</div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot users"></div>
              <span>Users</span>
            </div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot providers"></div>
              <span>Providers</span>
            </div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot bookings"></div>
              <span>Bookings</span>
            </div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot verification"></div>
              <span>Verification</span>
            </div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot withdrawals"></div>
              <span>Withdrawals</span>
            </div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot support"></div>
              <span>Support</span>
            </div>
            <div className="dash-legend-item">
              <div className="dash-legend-dot analytics"></div>
              <span>Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
