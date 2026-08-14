import { useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "catalog", label: "Catalog Upload", icon: "📤" },
    { id: "bulk", label: "Bulk Upload", icon: "📋" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "warehouse", label: "Warehouse", icon: "🏭" },
    { id: "pricing", label: "Pricing", icon: "🏷️" },
    { id: "returns", label: "Returns", icon: "↩️" },
    { id: "claims", label: "Claims", icon: "⚠️" },
    { id: "help", label: "Help", icon: "❓" }
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <aside className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sidebar-logo">ARTIC.IN</div>
        <nav className="sidebar-nav">
          {menuItems.map(({ id, label, icon }) => (
            <li key={id} className="nav-item">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(id);
                }}
                className={`nav-link ${activeMenu === id ? "active" : ""}`}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 70,
            display: "none"
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
