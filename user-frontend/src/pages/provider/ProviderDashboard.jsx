import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerAPI, walletAPI, notificationAPI, reviewAPI } from "../../services/api";
import "./ProviderPanel.css";

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
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

export default function ProviderDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
    completedJobs: 0,
    rating: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const profile = await providerAPI.getProfile();
      setProviderData(profile.data || {});

      const [walletRes, jobsRes, statsRes] = await Promise.all([
        walletAPI.getWallet(),
        providerAPI.getJobs(),
        providerAPI.getStats()
      ]);
      
      const wallet = walletRes.data || walletRes;
      const jobs = jobsRes.data || jobsRes;
      const providerStats = statsRes.data || statsRes;
      
      setStats({
        totalEarnings: providerStats.totalEarnings || wallet?.totalEarnings || 0,
        availableBalance: wallet?.balance || 0,
        pendingBalance: wallet?.pendingBalance || 0,
        completedJobs: providerStats.completedJobs || 0,
        rating: providerStats.rating || profile.data?.rating || 0
      });

      setRecentBookings((jobs || []).slice(0, 5));
      
      // Fetch notifications
      try {
        const notifRes = await notificationAPI.getNotifications();
        setNotifications(notifRes.data.notifications?.slice(0, 5) || []);
        setUnreadCount(notifRes.data.unreadCount || 0);
      } catch (notifErr) {
        console.log("Could not fetch notifications");
      }

      // Fetch reviews for provider
      try {
        const profile = await providerAPI.getProfile();
        const providerId = profile.data?._id || profile.data?.id;
        if (providerId) {
          const reviewRes = await reviewAPI.getProviderReviews(providerId);
          setReviews(reviewRes.data?.reviews?.slice(0, 5) || reviewRes.data?.slice(0, 5) || []);
        }
      } catch (revErr) {
        console.log("Could not fetch reviews");
      }
    } catch (err) {
      console.log("Using fallback data", err);
      const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
      setProviderData(stored);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="provider-layout">
        <ProviderSidebar providerData={null} />
        <main className="provider-main">
          <div className="provider-content">
            <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
              <div className="loading-spinner"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const providerName = providerData?.businessName || providerData?.fullName || "Partner";

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="page-title">Welcome back, {providerName} 👋</h1>
              <p className="page-subtitle mb-0">Here's what's happening with your services today.</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon primary">
                <TrendingUpIcon />
              </div>
              <div className="stat-card-label">Total Earnings</div>
              <div className="stat-card-value">₹{stats.totalEarnings.toLocaleString()}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon success">
                <WalletIcon />
              </div>
              <div className="stat-card-label">Available Balance</div>
              <div className="stat-card-value">₹{stats.availableBalance.toLocaleString()}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon info">
                <CheckCircleIcon />
              </div>
              <div className="stat-card-label">Completed Jobs</div>
              <div className="stat-card-value">{stats.completedJobs}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon warning">
                <StarIcon />
              </div>
              <div className="stat-card-label">Rating</div>
              <div className="stat-card-value">{stats.rating?.toFixed(1) || "0.0"} ⭐</div>
            </div>
          </div>

          <div className="two-col-layout">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Bookings</h3>
                <button className="btn btn-sm btn-secondary" onClick={() => navigate('/provider/bookings')}>
                  View All
                </button>
              </div>
              <div className="card-body p-0">
                {recentBookings.length > 0 ? (
                  <div className="tickets-list">
                    {recentBookings.map((booking) => (
                      <div key={booking._id} className="ticket-card" onClick={() => navigate('/provider/bookings')}>
                        <div className="ticket-icon">
                          <BookingIcon />
                        </div>
                        <div className="ticket-info">
                          <div className="ticket-title">{booking.service?.title || booking.service?.name || "Service"}</div>
                          <div className="ticket-meta">
                            {(booking.customerDetails?.name || booking.user?.name || "Customer")} · ₹{booking.totalAmount?.toLocaleString()} · {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`ticket-status ${booking.status || 'pending'}`}>
                          {booking.status || 'pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <BookingIcon />
                    <h3>No bookings yet</h3>
                    <p>Your recent bookings will appear here</p>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="badge badge-danger badge-pill">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="card-body p-0">
                {notifications.length > 0 ? (
                  <div className="tickets-list">
                    {notifications.map((notif) => (
                      <div key={notif._id} className="ticket-card" style={{ borderLeft: notif.isRead ? 'none' : '3px solid var(--primary)' }}>
                        <div className="ticket-info">
                          <div className="ticket-title" style={{ fontWeight: notif.isRead ? 500 : 600 }}>
                            {notif.title}
                          </div>
                          <div className="ticket-meta">
                            {notif.message}
                          </div>
                          <div className="ticket-meta mt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(notif.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p className="mb-1">No notifications yet</p>
                    <p style={{ fontSize: '12px' }}>You'll receive updates about bookings, payments, and more</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                  <h3 className="card-title">Recent Reviews</h3>
                </div>
                <div className="card-body p-0">
                  <div className="tickets-list">
                    {reviews.map((review) => (
                      <div key={review._id} className="ticket-card">
                        <div className="ticket-info">
                          <div className="ticket-title">
                            {review.service?.name || review.service?.title || "Service"}
                          </div>
                          <div className="ticket-meta">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: i < review.rating ? '#f59e0b' : '#e5e7eb', fontSize: '14px' }}>★</span>
                            ))}
                            <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>{review.user?.name || 'Customer'}</span>
                          </div>
                          {review.comment && (
                            <div className="ticket-meta mt-1" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                              "{review.comment}"
                            </div>
                          )}
                          <div className="ticket-meta mt-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
