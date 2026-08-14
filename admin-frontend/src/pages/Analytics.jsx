import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import axios from 'axios';
import '../styles/components.css';
import './Analytics.css';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  const token = adminInfo ? JSON.parse(adminInfo).token : null;
  return {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  };
};

// Try to import Recharts components
let LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Cell;
try {
  const Recharts = require('recharts');
  LineChart = Recharts.LineChart;
  BarChart = Recharts.BarChart;
  PieChart = Recharts.PieChart;
  XAxis = Recharts.XAxis;
  YAxis = Recharts.YAxis;
  CartesianGrid = Recharts.CartesianGrid;
  Tooltip = Recharts.Tooltip;
  Legend = Recharts.Legend;
  Line = Recharts.Line;
  Bar = Recharts.Bar;
  Cell = Recharts.Cell;
} catch (e) {
  // Recharts not installed, will show placeholder
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [services, setServices] = useState([]);

  const adminAuth = localStorage.getItem('adminInfo');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, bookingsRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, getAuthHeader()),
        axios.get(`${API_URL}/admin/bookings`, getAuthHeader()),
        axios.get(`${API_URL}/services`, getAuthHeader())
      ]);
      
      setStats(statsRes.data);
      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Monthly revenue data
  const monthlyRevenueData = useMemo(() => {
    const monthMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    bookings.forEach(b => {
      if (b.paymentStatus === 'paid') {
        const date = new Date(b.createdAt);
        const monthIndex = date.getMonth();
        const month = months[monthIndex];

        if (!monthMap[month]) {
          monthMap[month] = 0;
        }
        monthMap[month] += b.totalAmount || 0;
      }
    });

    return months.map(month => ({
      month,
      revenue: monthMap[month] || 0
    }));
  }, [bookings]);

  // Service-wise bookings
  const serviceBookingsData = useMemo(() => {
    const serviceMap = {};

    bookings.forEach(b => {
      const serviceName = b.service?.name || b.service?.title || b.serviceName || 'Unknown Service';
      if (!serviceMap[serviceName]) {
        serviceMap[serviceName] = 0;
      }
      serviceMap[serviceName] += 1;
    });

    return Object.entries(serviceMap).map(([service, count]) => ({
      service,
      bookings: count
    })).sort((a, b) => b.bookings - a.bookings).slice(0, 10);
  }, [bookings]);

  // Booking status breakdown
  const bookingStatusData = useMemo(() => {
    const statusMap = {
      'completed': 0,
      'pending': 0,
      'confirmed': 0,
      'cancelled': 0,
      'in_progress': 0
    };

    bookings.forEach(b => {
      const status = b.status?.toLowerCase() || 'pending';
      if (!statusMap[status]) {
        statusMap[status] = 0;
      }
      statusMap[status] += 1;
    });

    const colors = {
      'completed': '#10b981',
      'confirmed': '#3b82f6',
      'pending': '#f59e0b',
      'in_progress': '#8b5cf6',
      'cancelled': '#ef4444'
    };

    return Object.entries(statusMap).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      value: count,
      color: colors[status] || '#8884d8'
    }));
  }, [bookings]);

  // Payment method distribution
  const paymentMethodData = useMemo(() => {
    const methodMap = {};

    bookings.forEach(b => {
      const method = b.paymentMethod || 'COD';
      if (!methodMap[method]) {
        methodMap[method] = 0;
      }
      methodMap[method] += b.totalAmount || 0;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    return Object.entries(methodMap).map(([method, amount], index) => ({
      name: method.toUpperCase(),
      value: amount,
      color: colors[index % colors.length]
    }));
  }, [bookings]);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavbar />
          <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '16px', color: '#666' }}>Loading analytics...</p>
            </div>
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
          <div className="analytics-header">
            <h2>Analytics & Reports</h2>
            <p>Dashboard of performance and business metrics</p>
          </div>

          <div className="analytics-grid">
            {/* Monthly Revenue Chart */}
            <div className="chart-card">
              <h3>Monthly Revenue Trend</h3>
              {LineChart && XAxis && YAxis && CartesianGrid && Tooltip && Legend && Line ? (
                <LineChart
                  width={500}
                  height={300}
                  data={monthlyRevenueData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  className="chart"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 6 }}
                    name="Revenue (₹)"
                  />
                </LineChart>
              ) : (
                <div className="chart-placeholder">
                  <p>Install Recharts to view chart</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    Run: npm install recharts
                  </p>
                </div>
              )}
            </div>

            {/* Service-wise Bookings */}
            <div className="chart-card">
              <h3>Top Services by Bookings</h3>
              {BarChart && XAxis && YAxis && CartesianGrid && Tooltip && Legend && Bar ? (
                <BarChart
                  width={500}
                  height={300}
                  data={serviceBookingsData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  className="chart"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
                </BarChart>
              ) : (
                <div className="chart-placeholder">
                  <p>Install Recharts to view chart</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-overview">
            <div className="stat-overview-card">
              <h4>Total Bookings</h4>
              <p className="stat-value">{bookings.length}</p>
            </div>
            <div className="stat-overview-card">
              <h4>Total Revenue</h4>
              <p className="stat-value">₹{bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="stat-overview-card">
              <h4>Completed Bookings</h4>
              <p className="stat-value">{bookings.filter(b => b.status === 'completed').length}</p>
            </div>
            <div className="stat-overview-card">
              <h4>Avg Transaction</h4>
              <p className="stat-value">₹{bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / bookings.length).toLocaleString('en-IN') : 0}</p>
            </div>
          </div>

          {/* Booking Status Breakdown */}
          <div className="breakdown-section">
            <h3>Booking Status Distribution</h3>
            <div className="breakdown-items">
              {bookingStatusData.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <div className="status-dot" style={{ backgroundColor: item.color }} />
                  <span className="status-name">{item.name}</span>
                  <span className="status-count">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Distribution */}
          <div className="breakdown-section">
            <h3>Payment Method Distribution</h3>
            <div className="breakdown-items">
              {paymentMethodData.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <div className="status-dot" style={{ backgroundColor: item.color }} />
                  <span className="status-name">{item.name}</span>
                  <span className="status-count">₹{(item.value / 100000).toFixed(1)}L</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
