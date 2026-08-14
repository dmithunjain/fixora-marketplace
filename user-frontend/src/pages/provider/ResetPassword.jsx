import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/providers/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/provider/login"), 3000);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fff" }}>
      <Box sx={{ flex: 1, p: 6, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ position: "absolute", top: 20, left: 20 }}>
          <Button onClick={() => navigate("/provider/login")} startIcon={<KeyboardBackspaceIcon />} sx={{ color: "#4f46e5" }}>
            Back
          </Button>
        </Box>
        <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a2e" }}>
            Reset Password
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
            Enter your new password.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
              inputProps={{ minLength: 6 }}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
              inputProps={{ minLength: 6 }}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ py: 1.5, bgcolor: "#4f46e5", borderRadius: 2, fontWeight: 700, "&:hover": { bgcolor: "#4338ca" } }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Box>
      </Box>
      <Box sx={{
        flex: 1,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '40%', bgcolor: 'rgba(255,255,255,0.08)', top: -150, right: -150 }} />
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 400, textAlign: "center" }}>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
            Choose New Password
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            Set a strong password to secure your partner account.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
