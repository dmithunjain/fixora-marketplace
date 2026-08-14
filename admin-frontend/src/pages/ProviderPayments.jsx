import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import DataTable from "../components/DataTable";
import { providerAPI, paymentAPI } from "../services/api";
import { getServiceImage } from "../utils/serviceImages";
import "../styles/provider-payments.css";

const ProviderPayments = () => {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch providers + payment stats
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [providersData, statsData] = await Promise.all([
        providerAPI.getAll(),
        paymentAPI.getStats(),
      ]);

      setProviders(providersData || []);
      setStats(statsData || {});
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayStats = useMemo(() => {
    if (!stats || typeof stats !== "object") {
      return {
        totalPaymentsMade: 0,
        totalPaymentAmount: 0,
        pendingPaymentCount: 0,
        pendingPaymentAmount: 0,
        failedPayments: 0,
        averagePaymentAmount: 0,
      };
    }
    return stats;
  }, [stats]);

  // Pay Provider - Create payment for pending work
  const handlePayNow = async (provider) => {
    try {
      if (!provider.pendingPayments || provider.pendingPayments <= 0) {
        alert("No pending payments for this provider");
        return;
      }

      // In a real app, this would open a payment dialog
      // For now, show pending work proofs that need payment
      alert(`Provider: ${provider.providerName}\nPending Amount: ₹${provider.pendingPayments}`);
      navigate("/payment-system");
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing payment");
    }
  };

  // View Provider Details
  const handleViewDetails = (provider) => {
    navigate(`/provider-details/${provider._id}`);
  };

  const serviceTypes = [...new Set(providers.map((p) => p.serviceType))];

  const columns = [
    {
      key: "providerName",
      label: "Provider Name",
      render: (row) => (
        <div className="provider-cell">
          <img
            src={getServiceImage(row.serviceType || row.serviceName, row.id || row.providerId)}
            alt={row.providerName}
            className="provider-thumb"
          />
          <div className="provider-cell-info">
            <div className="provider-name">{row.providerName}</div>
            <div className="provider-service">{row.serviceType}</div>
          </div>
        </div>
      )
    },
    { key: "serviceType", label: "Service Type" },
    {
      key: "completedJobs",
      label: "Jobs Completed",
      render: (row) => row.completedJobs || 0,
    },
    {
      key: "totalEarnings",
      label: "Total Earnings",
      render: (row) => `₹${(row.totalEarnings || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "pendingPayments",
      label: "Pending Payments",
      render: (row) =>
        (row.pendingPayments || 0) > 0 ? (
          <span className="status-badge status-warning">
            ₹{row.pendingPayments.toLocaleString("en-IN")}
          </span>
        ) : (
          <span>₹0</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`status-badge status-${(
            row.status || "active"
          ).toLowerCase()}`}
        >
          {(row.status || "active").charAt(0).toUpperCase() +
            (row.status || "active").slice(1)}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="action-buttons">
          <button
            className="btn-view-earnings"
            onClick={() => handleViewDetails(row)}
          >
            View Details
          </button>

          {(row.pendingPayments || 0) > 0 && (
            <button className="btn-pay" onClick={() => handlePayNow(row)}>
              Pay Now
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="page-content">
            <div className="loading">Loading provider payments...</div>
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
          <div className="page-content">
            <div className="error">Error: {error}</div>
            <p>Make sure backend server is running on http://localhost:5000</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="main-content">
        <AdminNavbar />

        <div className="page-content">
          <div className="page-header">
            <h1>Provider Payments & Earnings</h1>
            <p>Manage service provider payments and track earnings</p>
          </div>

          {/* Payment Stats */}
          <div className="payment-stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h4>Total Payments Made</h4>
                <p className="stat-value">
                  {displayStats.totalPaymentsMade || 0}
                </p>
                <small>
                  ₹
                  {(displayStats.totalPaymentAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </small>
              </div>
            </div>

            <div className="stat-card stat-card-warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h4>Pending Payments</h4>
                <p className="stat-value">
                  {displayStats.pendingPaymentCount || 0}
                </p>
                <small>
                  ₹
                  {(displayStats.pendingPaymentAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </small>
              </div>
            </div>

            <div className="stat-card stat-card-danger">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h4>Failed Payments</h4>
                <p className="stat-value">{displayStats.failedPayments || 0}</p>
                <small>Requires retry</small>
              </div>
            </div>

            <div className="stat-card stat-card-info">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h4>Average Payment</h4>
                <p className="stat-value">
                  ₹
                  {(displayStats.averagePaymentAmount || 0).toLocaleString(
                    "en-IN"
                  )}
                </p>
                <small>Per transaction</small>
              </div>
            </div>
          </div>

          {/* Provider Table */}
          <div className="data-table-section">
            <h2 className="section-title">Provider Earnings Overview</h2>

            <DataTable
              data={providers}
              columns={columns}
              title="Service Provider Payments"
              searchFields={["providerName", "serviceType"]}
              filterFields={{
                serviceType: serviceTypes,
              }}
              pageSize={12}
            />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="action-card">
              <h3>🔍 Work Verification</h3>
              <p>Review and verify service provider work proofs</p>
              <button
                className="action-button"
                onClick={() => navigate("/admin/work-verification")}
              >
                Go to Verification
              </button>
            </div>

            <div className="action-card">
              <h3>💳 Payment History</h3>
              <p>View detailed payment transaction history</p>
              <button
                className="action-button"
                onClick={() => navigate("/payment-history")}
              >
                View History
              </button>
            </div>

            <div className="action-card">
              <h3>📈 Analytics</h3>
              <p>View payment analytics and reports</p>
              <button
                className="action-button"
                onClick={() => navigate("/payment-analytics")}
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPayments;