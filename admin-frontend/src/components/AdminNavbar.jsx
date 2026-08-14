import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FixoraLogo from "../assets/Logo1.png";

const adminPages = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  { id: 'users', label: 'Users', path: '/admin/users' },
  { id: 'providers', label: 'Providers', path: '/admin/providers' },
  { id: 'bookings', label: 'Bookings', path: '/admin/bookings' },
  { id: 'revenue', label: 'Revenue', path: '/admin/revenue' },
  { id: 'analytics', label: 'Analytics', path: '/admin/analytics' },
  { id: 'service-approvals', label: 'Service Approvals', path: '/admin/service-approvals' },
  { id: 'service-placement', label: 'Service Placement', path: '/admin/service-placement' },
  { id: 'withdrawal-approvals', label: 'Withdrawal Approvals', path: '/admin/withdrawal-approvals' },
  { id: 'support-tickets', label: 'Support Tickets', path: '/admin/support-tickets' },
  { id: 'service-highlights', label: 'Service Highlights', path: '/admin/service-highlights' },
  { id: 'payment-verifications', label: 'Payment Verifications', path: '/admin/payment-verifications' },
  { id: 'kyc-verifications', label: 'KYC Verifications', path: '/admin/kyc-verifications' },
  { id: 'bank-verifications', label: 'Bank Verifications', path: '/admin/bank-verifications' },
  { id: 'work-verification', label: 'Work Verification', path: '/admin/work-verification' },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const matched = adminPages.filter(page => 
      page.label.toLowerCase().includes(query) || 
      page.id.toLowerCase().includes(query)
    );
    setSuggestions(matched.slice(0, 6));
    setShowSuggestions(true);
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (page) => {
    setSearchQuery("");
    setShowSuggestions(false);
    navigate(page.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("authToken");
    } catch (e) {
      // ignore
    }
    navigate("/");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src={FixoraLogo} alt="Fixora Logo" />
        </div>
      </div>

      <div className="navbar-center" style={{ position: 'relative' }}>
        <div className="search-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search pages..." 
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((page) => (
              <div 
                key={page.id} 
                className="suggestion-item"
                onClick={() => handleSuggestionClick(page)}
              >
                <span className="suggestion-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </span>
                <span className="suggestion-text">{page.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navbar-right">
        <div className="navbar-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {formatTime(currentTime)}
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
