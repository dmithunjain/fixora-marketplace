import React, { useState, useMemo } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import DataTable from '../components/DataTable';
import transactions from '../data/transactions';
import '../styles/components.css';

const Revenue = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Calculate revenue statistics
  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;
    const averageTransaction = Math.round(totalRevenue / totalTransactions);

    const paymentMethodBreakdown = {};
    transactions.forEach(t => {
      paymentMethodBreakdown[t.paymentMethod] = (paymentMethodBreakdown[t.paymentMethod] || 0) + t.amount;
    });

    return {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      paymentMethodBreakdown
    };
  }, []);

  const columns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'userName', label: 'User' },
    { key: 'serviceName', label: 'Service' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => `₹${row.amount.toLocaleString('en-IN')}`
    },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'invoiceNumber', label: 'Invoice' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className="status-badge status-success">
          {row.status}
        </span>
      )
    }
  ];

  const paymentMethods = [...new Set(transactions.map(t => t.paymentMethod))];
  const services = [...new Set(transactions.map(t => t.serviceName))];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        <div className="page-content">
          {/* Revenue Statistics */}
          <div className="revenue-stats">
            <div className="revenue-card">
              <h3>Total Revenue</h3>
              <p className="revenue-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
              <small>Lifetime earnings</small>
            </div>
            <div className="revenue-card">
              <h3>Total Transactions</h3>
              <p className="revenue-value">{stats.totalTransactions}</p>
              <small>Completed payments</small>
            </div>
            <div className="revenue-card">
              <h3>Average Transaction</h3>
              <p className="revenue-value">₹{stats.averageTransaction.toLocaleString('en-IN')}</p>
              <small>Per transaction</small>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="payment-breakdown">
            <h3>Payment Method Distribution</h3>
            <div className="payment-methods">
              {Object.entries(stats.paymentMethodBreakdown).map(([method, amount]) => (
                <div key={method} className="payment-method-item">
                  <span className="method-name">{method}</span>
                  <span className="method-amount">₹{amount.toLocaleString('en-IN')}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(amount / stats.totalRevenue) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <DataTable
            data={transactions}
            columns={columns}
            title="Payment Transactions"
            searchFields={['transactionId', 'userName', 'serviceName', 'invoiceNumber']}
            filterFields={{
              paymentMethod: paymentMethods,
              serviceName: services
            }}
            pageSize={15}
          />
        </div>
      </div>
    </div>
  );
};

export default Revenue;
