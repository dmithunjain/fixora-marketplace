import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/provider/ProviderPanel.css";
import Logo from "../assets/Fixora3.png";

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" rx="1"></rect>
    <rect x="14" y="3" width="7" height="5" rx="1"></rect>
    <rect x="14" y="12" width="7" height="9" rx="1"></rect>
    <rect x="3" y="16" width="7" height="5" rx="1"></rect>
  </svg>
);

const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const BookingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const VerifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export default function ProviderSidebar({ providerData, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const providerName = providerData?.businessName || providerData?.fullName || "Provider";
  const providerCategory = providerData?.serviceCategory || "Service Partner";
  const isVerified = providerData?.isApproved === true;

  const navItems = [
    { path: "/provider/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/provider/notifications", label: "Notifications", icon: <BellIcon /> },
    { path: "/provider/profile", label: "Profile", icon: <ProfileIcon /> },
    { path: "/provider/add-service", label: "Add Service", icon: <AddIcon /> },
    { path: "/provider/my-services", label: "My Services", icon: <ServicesIcon /> },
    { path: "/provider/bookings", label: "Bookings", icon: <BookingIcon /> },
    { path: "/provider/wallet", label: "Wallet", icon: <WalletIcon /> },
    { path: "/provider/tickets", label: "Support", icon: <SupportIcon /> },
    { path: "/provider/verification", label: "Verification", icon: <VerifyIcon /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("providerAuth");
    localStorage.removeItem("providerData");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/provider/login");
    }
  };

  return (
    <aside className="provider-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={Logo} alt="Fixora" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span className="sidebar-logo-text">Fixora</span>
        </div>
        <span className="sidebar-subtitle">Provider Panel</span>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {providerName?.charAt(0)?.toUpperCase()}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{providerName}</div>
          <div className="sidebar-profile-category">{providerCategory}</div>
          {providerData?.location?.state && (
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
              📍 {providerData.location.city}, {providerData.location.state}
            </div>
          )}
          <div className={`sidebar-status-chip ${isVerified ? 'verified' : 'pending'}`}>
            {isVerified && <CheckIcon />}
            {isVerified ? "Verified" : "Pending"}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">Menu</div>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
}
