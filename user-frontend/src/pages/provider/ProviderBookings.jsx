import React, { useEffect, useState } from "react";
import ProviderSidebar from "../../components/ProviderSidebar";
import { providerAPI } from "../../services/api";
import "./ProviderPanel.css";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];

export default function ProviderBookings() {
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [updatingId, setUpdatingId] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadBookingId, setUploadBookingId] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, jobsRes] = await Promise.all([
        providerAPI.getProfile(),
        providerAPI.getJobs()
      ]);
      setProviderData(profileRes.data || null);
      setJobs(jobsRes.data || []);
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);
    try {
      await providerAPI.updateJobStatus(bookingId, status);
      await loadData();
    } catch (error) {
      setUpdatingId("");
    } finally {
      setUpdatingId("");
    }
  };

  const handleUploadImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result.split(',')[1]); // Store base64 without data URL prefix
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadWorkProof = async () => {
    if (!uploadImage || !uploadDescription) {
      setSnackbar({ open: true, message: "Please select an image and add a description", severity: "error" });
      return;
    }
    setUploadLoading(true);
    try {
      await providerAPI.uploadWorkProof(uploadBookingId, uploadImage, uploadDescription);
      setSnackbar({ open: true, message: "Work proof uploaded successfully!", severity: "success" });
      setUploadOpen(false);
      setUploadImage(null);
      setUploadDescription("");
      await loadData();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Failed to upload work proof", severity: "error" });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  return (
    <div className="provider-layout">
      <ProviderSidebar providerData={providerData} />

      <main className="provider-main">
        <div className="provider-content">
          <div className="page-header">
            <h1 className="page-title">Bookings</h1>
            <p className="page-subtitle">Manage customer schedules, status updates, and contact details.</p>
          </div>

          {loading ? (
            <div className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
                  <div className="loading-spinner"></div>
                </div>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="empty-state">
                  <h3>No bookings yet</h3>
                  <p>Your assigned bookings will appear here once customers place orders.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="tickets-list">
              {jobs.map((job) => (
                <div key={job._id} className="ticket-card">
                  <div className="ticket-info" style={{ width: "100%" }}>
                    <div className="ticket-title">{job.service?.title || job.service?.name || "Service"}</div>
                    <div className="ticket-meta" style={{ marginTop: 6 }}>
                      {new Date(job.bookingDate).toLocaleDateString()} · {job.bookingTime} · Rs.{job.totalAmount}
                    </div>
                    <div className="ticket-meta" style={{ marginTop: 6 }}>
                      Customer: {job.customerDetails?.name || job.user?.name || "N/A"} · {job.customerDetails?.phone || job.user?.phone || "N/A"}
                    </div>
                    <div className="ticket-meta" style={{ marginTop: 6 }}>
                      Address: {[job.address?.address, job.address?.city, job.address?.district, job.address?.state, job.address?.pincode].filter(Boolean).join(", ") || "Not provided"}
                    </div>

                    <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="status-badge status-open">{job.status}</span>
                      <select
                        value={job.status}
                        disabled={updatingId === job._id}
                        onChange={(e) => updateStatus(job._id, e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      
                      {/* Show work proof status if completed */}
                      {job.status === 'completed' && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                          {job.workProof ? (
                            <>
                              <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                              <Typography variant="caption" color="text.secondary">
                                Work proof uploaded
                              </Typography>
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<UploadFileIcon fontSize="small" />}
                              onClick={() => {
                                setUploadBookingId(job._id);
                                setUploadOpen(true);
                              }}
                              sx={{ px: 2, py: 0.5 }}
                            >
                              Upload Work Proof
                            </Button>
                          )}
                        </Box>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Work Proof Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm">
        <DialogTitle>Upload Work Proof</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            value={uploadDescription}
            onChange={(e) => setUploadDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImageChange}
            style={{ display: 'block', width: '100%', marginBottom: 16 }}
          />
          {uploadImage && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img
                src={`data:image/jpeg;base64,${uploadImage}`}
                alt="Preview"
                style={{ maxWidth: '100%', height: 200, objectFit: 'contain', borderRadius: 4 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUploadWorkProof}
            disabled={uploadLoading}
          >
            {uploadLoading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}