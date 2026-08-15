import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supportAPI } from "../services/api";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";

export default function Support() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchTickets();
    }
  }, [user, navigate]);

  const fetchTickets = async () => {
    try {
      const response = await supportAPI.getTickets();
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await supportAPI.createTicket(formData);

      if (response.data && response.data._id) {
        setTickets([response.data, ...tickets]);
        setShowForm(false);
        setFormData({ subject: "", description: "", category: "general", priority: "medium" });
        setMessage({ type: "success", text: "Ticket created successfully!" });
      } else {
        setMessage({ type: "error", text: "Error creating ticket" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 1, color: "#1a1a2e" }}>
              Support Center
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              Get help with your bookings, payments, and services
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={showForm ? <InboxIcon /> : <AddCircleIcon />}
            onClick={() => setShowForm(!showForm)}
            sx={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              px: 3
            }}
          >
            {showForm ? "View My Tickets" : "Create New Ticket"}
          </Button>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }}>
            {message.text}
          </Alert>
        )}

        {showForm ? (
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                Create New Support Ticket
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief description of your issue"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      SelectProps={{ native: true }}
                    >
                      <option value="general">General</option>
                      <option value="booking">Booking</option>
                      <option value="payment">Payment</option>
                      <option value="service">Service</option>
                      <option value="provider">Provider</option>
                      <option value="refund">Refund</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      SelectProps={{ native: true }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      required
                      placeholder="Describe your issue in detail. Include any relevant booking IDs, dates, or other information that might help us assist you better."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit"
                      variant="contained"
                      startIcon={<SendIcon />}
                      disabled={submitting}
                      sx={{ 
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 2,
                        px: 4
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        ) : !Array.isArray(tickets) || tickets.length === 0 ? (
          <Card sx={{ borderRadius: 3, textAlign: "center", py: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <InboxIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No support tickets yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Need help? Create a ticket and our team will assist you.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setShowForm(true)}
              sx={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                px: 4
              }}
            >
              Create Your First Ticket
            </Button>
          </Card>
        ) : (
          <Stack spacing={2}>
            {tickets.map((ticket) => (
              <Card 
                key={ticket._id}
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  border: selectedTicket?._id === ticket._id ? "2px solid #667eea" : "2px solid transparent",
                  "&:hover": { borderColor: "#667eea", transform: "translateY(-2px)" },
                  transition: "all 0.2s"
                }}
                onClick={() => setSelectedTicket(selectedTicket?._id === ticket._id ? null : ticket)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ color: "#667eea" }}>
                        {ticket.ticketNumber}
                      </Typography>
                      <Chip 
                        label={ticket.category} 
                        size="small" 
                        sx={{ bgcolor: "#f0f4ff", color: "#667eea", fontWeight: 500 }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip 
                        label={ticket.priority} 
                        size="small"
                        sx={{ 
                          bgcolor: ticket.priority === "urgent" ? "#ffebee" : 
                                   ticket.priority === "high" ? "#fff3e0" : "#f5f5f5",
                          color: ticket.priority === "urgent" ? "#c62828" :
                                 ticket.priority === "high" ? "#e65100" : "#666",
                          fontWeight: 500
                        }}
                      />
                      <Chip 
                        label={ticket.status?.replace("_", " ")} 
                        size="small"
                        sx={{ 
                          bgcolor: ticket.status === "open" ? "#e8f5e9" :
                                   ticket.status === "pending" ? "#fff3e0" :
                                   ticket.status === "in_progress" ? "#e3f2fd" : "#f5f5f5",
                          color: ticket.status === "open" ? "#2e7d32" :
                                 ticket.status === "pending" ? "#e65100" :
                                 ticket.status === "in_progress" ? "#1565c0" : "#666",
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, color: "#1a1a2e" }}>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created on {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
                  </Typography>

                  {selectedTicket?._id === ticket._id && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #e0e0e0" }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: "#666", fontWeight: 500 }}>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {ticket.description}
                      </Typography>
                      
                      {ticket.responses && ticket.responses.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 2, color: "#666", fontWeight: 500 }}>
                            Conversation ({ticket.responses.length} responses)
                          </Typography>
                          <Stack spacing={2}>
                            {ticket.responses.map((response, idx) => (
                              <Box 
                                key={idx}
                                sx={{ 
                                  p: 2, 
                                  borderRadius: 2,
                                  bgcolor: response.isAdmin ? "#e8f5e9" : "#f5f5f5"
                                }}
                              >
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                  <Typography variant="body2" fontWeight="600">
                                    {response.isAdmin ? "Support Team" : "You"}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(response.createdAt).toLocaleString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  {response.message}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
