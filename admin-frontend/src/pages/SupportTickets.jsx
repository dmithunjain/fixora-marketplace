import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { adminAPI } from '../services/adminApi';
import '../styles/components.css';
import './SupportTickets.css';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', category: '', priority: '' });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.category) params.category = filter.category;
      if (filter.priority) params.priority = filter.priority;
      
      const response = await adminAPI.getSupportTickets(params);
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await adminAPI.updateTicketStatus(ticketId, newStatus);
      fetchTickets();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleRespond = async () => {
    if (!response.trim()) return;
    setSending(true);
    
    try {
      await adminAPI.respondToTicket(selectedTicket._id, response);
      setResponse('');
      fetchTickets();
      setSelectedTicket(null);
    } catch (err) {
      console.error('Error sending response:', err);
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: '#10b981',
      pending: '#f59e0b',
      in_progress: '#3b82f6',
      resolved: '#6b7280',
      closed: '#6b7280'
    };
    return <span className="status-badge" style={{ backgroundColor: colors[status] || '#6b7280' }}>{status?.replace('_', ' ')}</span>;
  };

  const getPriorityBadge = (priority) => {
    return <span className={`priority-badge ${priority}`}>{priority}</span>;
  };

  const openCount = tickets.filter(t => t.status === 'open').length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="main-content">
        <AdminNavbar />
        
        <div className="page-content">
          <div className="tickets-header">
            <div className="tickets-header-left">
              <h1>Support Tickets</h1>
              <p>Manage and respond to user support requests</p>
            </div>
            <div className="tickets-header-right">
              <div className="ticket-count-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <span>{openCount} Open</span>
              </div>
            </div>
          </div>

          <div className="tickets-filters">
            <select onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
              <option value="">All Categories</option>
              <option value="booking">Booking</option>
              <option value="payment">Payment</option>
              <option value="service">Service</option>
              <option value="provider">Provider</option>
              <option value="refund">Refund</option>
              <option value="complaint">Complaint</option>
              <option value="general">General</option>
            </select>
            <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {loading ? (
            <div className="tickets-loading"></div>
          ) : tickets.length === 0 ? (
            <div className="tickets-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>No Tickets Found</h3>
              <p>No support tickets found matching your filters.</p>
            </div>
          ) : (
            <div className="tickets-table-container">
              <div className="tickets-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket #</th>
                      <th>Subject</th>
                      <th>User</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className={selectedTicket?._id === ticket._id ? 'selected' : ''}>
                        <td><span className="ticket-number">{ticket.ticketNumber}</span></td>
                        <td><span className="ticket-subject">{ticket.subject}</span></td>
                        <td>
                          <div className="ticket-user">
                            <span className="ticket-user-name">{ticket.user?.name || ticket.provider?.businessName || 'N/A'}</span>
                            <span className="ticket-user-type">{ticket.userType || 'User'}</span>
                          </div>
                        </td>
                        <td><span className="category-tag">{ticket.category}</span></td>
                        <td>{getPriorityBadge(ticket.priority)}</td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td><span className="ticket-date">{new Date(ticket.createdAt).toLocaleDateString()}</span></td>
                        <td>
                          <div className="ticket-actions">
                            <button className="btn-view" onClick={() => setSelectedTicket(ticket)}>View</button>
                            <select 
                              value={ticket.status}
                              onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                              className="status-select"
                            >
                              <option value="open">Open</option>
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedTicket && (
        <div className="ticket-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2>{selectedTicket.subject}</h2>
                <span className="ticket-number">{selectedTicket.ticketNumber}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedTicket(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="ticket-meta-row">
                <span className="category-tag">{selectedTicket.category}</span>
                {getPriorityBadge(selectedTicket.priority)}
                {getStatusBadge(selectedTicket.status)}
              </div>
              <div className="ticket-info">
                <p><strong>User:</strong> {selectedTicket.user?.name || selectedTicket.provider?.businessName || 'N/A'}</p>
                <p><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
              <div className="ticket-description">
                <h4>Description</h4>
                <p>{selectedTicket.description}</p>
              </div>
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div className="ticket-responses">
                  <h4>Conversation ({selectedTicket.responses.length})</h4>
                  {selectedTicket.responses.map((resp, idx) => (
                    <div key={idx} className={`response ${resp.isAdmin ? 'admin' : 'user'}`}>
                      <div className="response-header">
                        <span className="responder">{resp.isAdmin ? 'Support Team' : (selectedTicket.user?.name || 'User')}</span>
                        <span className="date">{new Date(resp.createdAt).toLocaleString()}</span>
                      </div>
                      <p>{resp.message}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="response-form">
                <h4>Add Response</h4>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response to the user..."
                  rows="4"
                />
                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setSelectedTicket(null)}>Cancel</button>
                  <button 
                    className="btn-submit" 
                    onClick={handleRespond}
                    disabled={sending || !response.trim()}
                  >
                    {sending ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
