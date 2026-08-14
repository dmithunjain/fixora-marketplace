import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { notificationAPI } from "../../services/api";
import "./ProviderPanel.css";

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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

const PaymentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
  </svg>
);

const getNotificationIcon = (type) => {
  switch (type) {
    case 'booking':
      return <BookingIcon />;
    case 'payment':
      return <PaymentIcon />;
    case 'withdrawal':
      return <WalletIcon />;
    default:
      return <BellIcon />;
  }
};

export default function Notifications() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadNotifications();
  }, [navigate, filter]);

  const loadNotifications = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
      setProviderData(stored);

      const params = {};
      if (filter === 'unread') params.unread = 'true';

      const res = await notificationAPI.getNotifications(params);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.log("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.log("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.log("Error marking all as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      const wasUnread = notifications.find(n => n._id === id && !n.isRead);
      setNotifications(notifications.filter(n => n._id !== id));
      if (wasUnread) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (err) {
      console.log("Error deleting notification:", err);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

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

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header">
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">Stay updated with your bookings, payments, and more</p>
          </div>

          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter('unread')}
                >
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>
              {unreadCount > 0 && (
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={markAllAsRead}
                >
                  <CheckIcon /> Mark all as read
                </button>
              )}
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {notifications.length === 0 ? (
                <div className="empty-state" style={{ padding: '60px 20px' }}>
                  <BellIcon />
                  <h3>No notifications</h3>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => !notif.isRead && markAsRead(notif._id)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notif.title}</div>
                        <div className="notification-message">{notif.message}</div>
                        <div className="notification-time">{formatTime(notif.createdAt)}</div>
                      </div>
                      <button 
                        className="notification-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}
                        title="Delete notification"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
