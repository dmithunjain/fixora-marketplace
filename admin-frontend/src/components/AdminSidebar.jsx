import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const menuItems = [
    { path: "/admin/dashboard", icon: "📈", label: "Dashboard" },
    { path: "/admin/users", icon: "👤", label: "Users" },
    { path: "/admin/providers", icon: "🏢", label: "Providers" },
    { path: "/admin/provider-registrations", icon: "📋", label: "Registrations" },
    { path: "/admin/provider-verification", icon: "✔️", label: "Verification" },
    { path: "/admin/bookings", icon: "📅", label: "Bookings" },
    { path: "/admin/service-approvals", icon: "🔍", label: "Service Approvals" },
    { path: "/admin/service-placement", icon: "📌", label: "Publish Services" },
    { path: "/admin/withdrawal-approvals", icon: "💸", label: "Withdrawals" },
    { path: "/admin/payment-verifications", icon: "💰", label: "Payments" },
    { path: "/admin/bank-verifications", icon: "🏦", label: "Bank Verify" },
    { path: "/admin/support-tickets", icon: "🎧", label: "Support" },
    { path: "/admin/service-highlights", icon: "⭐", label: "Highlights" },
    { path: "/admin/password-reset-approvals", icon: "🔑", label: "Password Resets" },
    { path: "/admin/analytics", icon: "📊", label: "Analytics" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h3>Navigation</h3>}
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            title={isCollapsed ? item.label : ""}
          >
            <span className="icon">{item.icon}</span>
            {!isCollapsed && <span className="label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
