import { useState } from "react";
import "../styles/Header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("supplierToken");
    localStorage.removeItem("supplierName");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="header-logo mobile">
          ARTIC.IN
        </a>
        <p className="header-title">Supplier Dashboard</p>
      </div>

      <div className="header-right">
        <button className="header-btn">
          🔔
          <span className="notification-badge"></span>
        </button>

        <button className="header-btn">
          ❓
        </button>

        <div className="profile-dropdown">
          <button
            className="profile-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="profile-avatar">
              {localStorage.getItem("supplierName")?.charAt(0).toUpperCase() || "S"}
            </div>
            <span>▼</span>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href="#profile">Profile Settings</a>
              <a href="#account">Account</a>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
