import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const DashboardCards = ({ stats }) => {
  const navigate = useNavigate();

  const navigationMap = {
    'Total Users': '/admin/users',
    'Service Providers': '/admin/providers',
    'Total Bookings': '/admin/bookings',
    'Pending Approvals': '/admin/approvals',
    'Blocked Users': '/admin/blocked-users',
    'Total Revenue': '/admin/revenue',
    'Monthly Growth': '/admin/analytics',
    'Provider Payments': '/provider-payments'
  };

  const handleCardClick = (label) => {
    const path = navigationMap[label];
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="stats-container">
      {stats.map((stat, index) => (
        <button
          key={index}
          type="button"
          className="stat-card"
          style={{ '--card-accent': stat.color, '--card-accent-light': `${stat.color}40` }}
          onClick={() => handleCardClick(stat.label)}
          aria-label={`Open ${stat.label}`}
        >
          <div className="stat-icon-wrapper" style={{ background: `${stat.color}15` }}>
            <span className="stat-icon">{stat.icon}</span>
          </div>
          <h3 className="stat-label">{stat.label}</h3>
          <p className="stat-value">{stat.value}</p>
        </button>
      ))}
    </div>
  );
};

export default DashboardCards;
