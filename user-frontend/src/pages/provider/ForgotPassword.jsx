import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const sendRequest = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    setRequestStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/providers/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setRequestStatus({ status: 'pending' });
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    setRequestStatus(null);

    try {
      const res = await fetch(`http://localhost:5000/api/providers/password-reset-check/${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setRequestStatus(data);
      } else {
        const data = await res.json();
        setError(data.message || 'No request found');
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }
    setResetLoading(true);
    setResetMessage("");
    setResetError("");

    try {
      const res = await fetch("http://localhost:5000/api/providers/password-reset-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setResetMessage(data.message);
        setTimeout(() => navigate("/provider/login"), 3000);
      } else {
        setResetError(data.message);
      }
    } catch {
      setResetError("Something went wrong. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff" }}>
      <Box sx={{ flex: 1, p: 6, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 20, left: 20 }}>
          <Button onClick={() => navigate("/provider/login")} startIcon={<KeyboardBackspaceIcon />} sx={{ color: "#4f46e5" }}>
            Back
          </Button>
        </Box>
        <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>

          {resetMessage ? (
            <>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "#1a1a2e" }}>Password Updated</Typography>
              <Alert severity="success" sx={{ mb: 2 }}>{resetMessage}</Alert>
            </>
          ) : requestStatus?.status === 'approved' ? (
            <>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a2e" }}>
                Set New Password
              </Typography>
              <Alert severity="success" sx={{ mb: 3 }}>
                Your request has been approved by admin! Set a new password below.
              </Alert>

              <form onSubmit={handleResetPassword}>
                <TextField
                  fullWidth type="password" placeholder="New Password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }} required inputProps={{ minLength: 6 }}
                />
                <TextField
                  fullWidth type="password" placeholder="Confirm Password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{ mb: 3 }} required inputProps={{ minLength: 6 }}
                />
                {resetError && <Alert severity="error" sx={{ mb: 2 }}>{resetError}</Alert>}
                <Button fullWidth type="submit" variant="contained" disabled={resetLoading}
                  sx={{ py: 1.5, bgcolor: "#10b981", borderRadius: 2, fontWeight: 700, "&:hover": { bgcolor: "#059669" } }}>
                  {resetLoading ? "Resetting..." : "Update Password"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a2e" }}>
                Forgot Password
              </Typography>
              <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
                Enter your partner email to request a password reset.
              </Typography>

              <TextField
                fullWidth type="email" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }} required
              />

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

              {requestStatus?.status === 'pending' && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Your request is pending admin approval. Check back later.
                </Alert>
              )}
              {requestStatus?.status === 'rejected' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Request rejected{requestStatus.rejectionReason ? `: ${requestStatus.rejectionReason}` : ''}.
                </Alert>
              )}

              <Button fullWidth variant="contained" onClick={sendRequest} disabled={loading || !email}
                sx={{ py: 1.5, bgcolor: "#4f46e5", borderRadius: 2, fontWeight: 700, "&:hover": { bgcolor: "#4338ca" }, mb: 2 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : "Send Request to Admin"}
              </Button>

              <Button fullWidth variant="outlined" onClick={checkStatus} disabled={loading || !email}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, borderColor: "#4f46e5", color: "#4f46e5" }}>
                {loading ? <CircularProgress size={20} /> : "Check Request Status"}
              </Button>
            </>
          )}

        </Box>
      </Box>
      <Box sx={{
        flex: 1,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        display: { xs: "none", md: "flex" },
        alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden"
      }}>
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '40%', bgcolor: 'rgba(255,255,255,0.08)', top: -150, right: -150 }} />
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 400, textAlign: "center", p: 4 }}>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
            {requestStatus?.status === 'approved' ? 'Set New Password' : 'Reset Your Password'}
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            {requestStatus?.status === 'approved'
              ? 'Admin approved your request. Set a new password now.'
              : 'Send a request and admin will approve it.'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
