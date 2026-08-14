import React, { useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { paymentRecords, providerPaymentSummary } from '../data/providerPayments';
import '../styles/provider-payments.css';

const PaymentAnalytics = () => {
  // Monthly payout data
  const monthlyPayoutData = useMemo(() => {
    const monthMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    paymentRecords
      .filter(p => p.paymentStatus === 'Paid')
      .forEach(payment => {
        const date = new Date(payment.paymentDate);
        const monthIndex = date.getMonth();
        const month = months[monthIndex];

        if (!monthMap[month]) {
          monthMap[month] = { count: 0, amount: 0 };
        }
        monthMap[month].count += 1;
        monthMap[month].amount += payment.amount;
      });

    return months.map(month => ({
      month,
      count: monthMap[month]?.count || 0,
      amount: monthMap[month]?.amount || 0
    }));
  }, []);

  // Top earning service providers
  const topProviders = useMemo(() => {
    return providerPaymentSummary
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 10)
      .map((provider, index) => ({
        rank: index + 1,
        ...provider
      }));
  }, []);

  // Earnings by service type
  const earningsByService = useMemo(() => {
    const serviceMap = {};

    paymentRecords
      .filter(p => p.paymentStatus === 'Paid')
      .forEach(payment => {
        if (!serviceMap[payment.serviceName]) {
          serviceMap[payment.serviceName] = { count: 0, amount: 0 };
        }
        serviceMap[payment.serviceName].count += 1;
        serviceMap[payment.serviceName].amount += payment.amount;
      });

    return Object.entries(serviceMap)
      .map(([service, data]) => ({
        service,
        ...data
      }))
      .sort((a, b) => b.amount - a.amount);
  }, []);

  // Payment method distribution
  const paymentMethodDistribution = useMemo(() => {
    const methodMap = {};

    paymentRecords
      .filter(p => p.paymentStatus === 'Paid')
      .forEach(payment => {
        if (!methodMap[payment.paymentMethod]) {
          methodMap[payment.paymentMethod] = { count: 0, amount: 0 };
        }
        methodMap[payment.paymentMethod].count += 1;
        methodMap[payment.paymentMethod].amount += payment.amount;
      });

    return Object.entries(methodMap).map(([method, data]) => ({
      method,
      ...data
    }));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          <div className="page-header">
            <h1>Payment Analytics & Reports</h1>
            <p>Detailed insights into provider payments and earnings</p>
          </div>

          {/* Key Metrics */}
          <div className="analytics-metrics">
            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-info">
                <h4>Total Paid Out</h4>
                <p className="metric-value">
                  ₹{paymentRecords
                    .filter(p => p.paymentStatus === 'Paid')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-info">
                <h4>Total Transactions</h4>
                <p className="metric-value">
                  {paymentRecords.filter(p => p.paymentStatus === 'Paid').length}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-info">
                <h4>Active Providers</h4>
                <p className="metric-value">
                  {[...new Set(paymentRecords.map(p => p.providerId))].length}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-info">
                <h4>Avg Payment</h4>
                <p className="metric-value">
                  ₹
                  {Math.round(
                    paymentRecords
                      .filter(p => p.paymentStatus === 'Paid')
                      .reduce((sum, p) => sum + p.amount, 0) /
                      (paymentRecords.filter(p => p.paymentStatus === 'Paid').length || 1)
                  ).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="analytics-grid">
            {/* Monthly Payouts */}
            <div className="chart-card">
              <h2>Monthly Payouts</h2>
              <div className="chart-placeholder">
                <div className="mini-chart">
                  {monthlyPayoutData.map((data, index) => (
                    <div key={index} className="chart-bar">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${(data.amount / Math.max(...monthlyPayoutData.map(d => d.amount))) * 100}%`
                        }}
                        title={`${data.month}: ₹${data.amount.toLocaleString('en-IN')}`}
                      />
                      <small>{data.month}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="chart-card">
              <h2>Payment Methods Used</h2>
              <div className="chart-placeholder">
                <div className="method-distribution">
                  {paymentMethodDistribution.map((method, index) => (
                    <div key={index} className="method-row">
                      <span className="method-name">{method.method}</span>
                      <div className="method-bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(method.amount / paymentRecords.filter(p => p.paymentStatus === 'Paid').reduce((sum, p) => sum + p.amount, 0)) * 100}%`
                          }}
                        />
                      </div>
                      <span className="method-amount">
                        {method.count} • ₹{method.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Earning Providers */}
          <div className="analytics-section">
            <h2>Top 10 Earning Service Providers</h2>
            <div className="providers-ranking">
              <div className="ranking-header">
                <span className="rank-col">Rank</span>
                <span className="name-col">Provider Name</span>
                <span className="service-col">Service</span>
                <span className="jobs-col">Jobs</span>
                <span className="earnings-col">Total Earnings</span>
              </div>

              {topProviders.map((provider) => (
                <div key={provider.providerId} className="ranking-row">
                  <span className="rank-col">
                    <strong>#{provider.rank}</strong>
                  </span>
                  <span className="name-col">{provider.providerName}</span>
                  <span className="service-col">{provider.serviceType}</span>
                  <span className="jobs-col">{provider.completedJobs}</span>
                  <span className="earnings-col">
                    <strong>₹{provider.totalEarnings.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings by Service Type */}
          <div className="analytics-section">
            <h2>Earnings by Service Type</h2>
            <div className="service-earnings">
              {earningsByService.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-header">
                    <h3>{service.service}</h3>
                    <span className="service-count">{service.count} payments</span>
                  </div>
                  <div className="service-footer">
                    <span className="service-amount">
                      ₹{service.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="service-avg">
                      Avg: ₹{Math.round(service.amount / service.count).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status Summary */}
          <div className="analytics-section">
            <h2>Payment Status Summary</h2>
            <div className="status-summary">
              <div className="status-box status-successful">
                <h4>Successful</h4>
                <p>{paymentRecords.filter(p => p.paymentStatus === 'Paid').length}</p>
                <small>
                  ₹
                  {paymentRecords
                    .filter(p => p.paymentStatus === 'Paid')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString('en-IN')}
                </small>
              </div>

              <div className="status-box status-failed">
                <h4>Failed</h4>
                <p>{paymentRecords.filter(p => p.paymentStatus === 'Failed').length}</p>
                <small>
                  ₹
                  {paymentRecords
                    .filter(p => p.paymentStatus === 'Failed')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString('en-IN')}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
