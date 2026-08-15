import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { supportAPI } from "../../services/api";
import "./ProviderPanel.css";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function ProviderTickets() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [providerData, setProviderData] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  useEffect(() => {
    const auth = localStorage.getItem("providerAuth");
    if (!auth) {
      navigate("/provider/login");
      return;
    }
    loadTickets();
  }, [navigate]);

  const loadTickets = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("providerData") || "{}");
      setProviderData(stored);
      
      const res = await supportAPI.getTickets();
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Tickets fetch error:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      setMessage({ type: "error", text: "Please fill subject and description" });
      return;
    }

    setSubmitting(true);
    try {
      await supportAPI.createTicket(newTicket);
      setMessage({ type: "success", text: "Ticket created successfully!" });
      setNewTicket({ subject: "", description: "", category: "general", priority: "medium" });
      setCreateDialogOpen(false);
      loadTickets();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create ticket" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      const res = await supportAPI.getTicketById(ticket._id || ticket.id);
      setSelectedTicket(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load ticket details" });
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    
    setSubmitting(true);
    try {
      await supportAPI.respondToTicket(selectedTicket._id, replyMessage);
      setReplyMessage("");
      handleViewTicket(selectedTicket._id);
      loadTickets();
      setMessage({ type: "success", text: "Reply sent!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to send reply" });
    } finally {
      setSubmitting(false);
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

  const getStatusBadge = (status) => {
    const statusMap = {
      resolved: { class: "badge-success", label: "Resolved" },
      closed: { class: "badge-secondary", label: "Closed" },
      open: { class: "badge-warning", label: "Open" }
    };
    const info = statusMap[status] || statusMap.open;
    return <span className={`badge ${info.class}`}>{info.label}</span>;
  };

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />
      
      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h1 className="page-title">Support Tickets</h1>
              <p className="page-subtitle mb-0">Get help and track your support requests</p>
            </div>
            <button className="btn btn-primary" onClick={() => setCreateDialogOpen(true)}>
              <PlusIcon />
              New Ticket
            </button>
          </div>

          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : message.type === "error" ? "alert-danger" : "alert-info"}`}>
              {message.text}
            </div>
          )}

          {tickets.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <MessageIcon />
                <h3>No tickets yet</h3>
                <p>Your support tickets will appear here</p>
                <button className="btn btn-primary mt-3" onClick={() => setCreateDialogOpen(true)}>
                  <PlusIcon />
                  Create First Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body p-0">
                <div className="tickets-list">
                  {tickets.map((ticket, index) => (
                    <div key={ticket._id || index} className="ticket-card">
                      <div className="ticket-icon">
                        <MessageIcon />
                      </div>
                      <div className="ticket-info">
                        <div className="ticket-title">{ticket.subject || ticket.title || "Untitled Ticket"}</div>
                        <div className="ticket-meta">
                          {ticket.description?.substring(0, 80)}{ticket.description?.length > 80 ? "..." : ""}
                        </div>
                        <div className="ticket-meta mt-1">
                          <span className="text-muted">Created:</span> {new Date(ticket.createdAt || Date.now()).toLocaleDateString()}
                          {ticket.category && <span className="badge badge-primary badge-sm ms-2">{ticket.category}</span>}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        <button className="btn btn-outline btn-sm" onClick={() => handleViewTicket(ticket)}>
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Ticket Dialog */}
      {createDialogOpen && (
        <div className="dialog-overlay" onClick={() => setCreateDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Create Support Ticket</h3>
              <button className="dialog-close" onClick={() => setCreateDialogOpen(false)}><CloseIcon /></button>
            </div>
            <div className="dialog-body">
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-select"
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="payment">Payment Issue</option>
                      <option value="booking">Booking Problem</option>
                      <option value="account">Account Issue</option>
                      <option value="technical">Technical Problem</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select"
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Description *</label>
                <textarea 
                  className="form-control"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                />
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-outline" onClick={() => setCreateDialogOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateTicket} disabled={submitting}>
                {submitting ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Dialog */}
      {selectedTicket && (
        <div className="dialog-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="dialog dialog-lg" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{selectedTicket.subject}</h3>
              <button className="dialog-close" onClick={() => setSelectedTicket(null)}><CloseIcon /></button>
            </div>
            <div className="dialog-body">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className={`badge ${selectedTicket.status === 'resolved' ? 'badge-success' : selectedTicket.status === 'closed' ? 'badge-secondary' : 'badge-warning'}`}>
                  {selectedTicket.status?.toUpperCase()}
                </span>
                <span className="text-muted">
                  Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </span>
                {selectedTicket.priority && (
                  <span className={`badge ${selectedTicket.priority === 'high' ? 'badge-danger' : selectedTicket.priority === 'medium' ? 'badge-warning' : 'badge-secondary'}`}>
                    {selectedTicket.priority} priority
                  </span>
                )}
              </div>
              
              <div className="ticket-message mb-4">
                <p className="mb-0">{selectedTicket.description}</p>
              </div>

              {selectedTicket.responses?.length > 0 && (
                <div className="ticket-responses">
                  <h4 className="fs-6 fw-semibold mb-3">Responses</h4>
                  {selectedTicket.responses.map((resp, idx) => (
                    <div key={idx} className={`ticket-response ${resp.isAdmin ? 'admin' : 'user'}`}>
                      <div className="ticket-response-header">
                        <span className="fw-semibold">{resp.isAdmin ? 'Admin Support' : 'You'}</span>
                        <span className="text-muted">{new Date(resp.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="mb-0">{resp.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                <div className="mt-4">
                  <label className="form-label">Reply</label>
                  <textarea
                    className="form-control"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                  />
                  <button 
                    className="btn btn-primary mt-3" 
                    onClick={handleReply}
                    disabled={submitting || !replyMessage.trim()}
                  >
                    {submitting ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
