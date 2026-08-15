import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, TextField, Button, CircularProgress, 
  Alert, Paper, InputAdornment, IconButton, Divider, Select, MenuItem, FormControl, Dialog, DialogContent, DialogActions
} from "@mui/material";
import { providerAPI } from "../../services/api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import WorkIcon from "@mui/icons-material/Work";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CelebrationIcon from '@mui/icons-material/Celebration';

const ProviderLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    serviceCategory: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [providerName, setProviderName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await providerAPI.login(loginData);
      
      localStorage.setItem("providerAuth", JSON.stringify(response.data));
      localStorage.setItem("providerData", JSON.stringify({
        id: response.data.user?.id,
        token: response.data.token,
        fullName: response.data.user?.name || response.data.provider?.fullName,
        phone: response.data.user?.phone || response.data.provider?.phone,
        email: response.data.user?.email || response.data.provider?.email,
        service: response.data.provider?.serviceCategory || loginData.serviceCategory,
        isApproved: response.data.provider?.isApproved || false,
      }));

      // Check if account is not approved (pending verification)
      if (response.data.provider?.isApproved === false) {
        setShowPendingDialog(true);
        setLoading(false);
        return;
      }

      // Check if this is first login after approval
      if (response.data.provider?.firstLoginAfterApproval) {
        setProviderName(response.data.user?.name || "Partner");
        setShowWelcomeDialog(true);
        setLoading(false);
        return;
      }
      
      navigate("/provider/dashboard");
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePendingDialogClose = () => {
    setShowPendingDialog(false);
    localStorage.removeItem('providerAuth');
    localStorage.removeItem('providerData');
  };

  const handleWelcomeDialogClose = () => {
    setShowWelcomeDialog(false);
    navigate("/provider/dashboard");
  };

  return (
    <Box sx={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw",
      overflow: "hidden",
      bgcolor: "#fff",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* LEFT FORM SECTION */}
      <Box sx={{
        flex: 1,
        p: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        {/* TOP NAV */}
        <Box sx={{ position: "absolute", top: 20, left: 20 }}>
          <IconButton onClick={() => navigate("/")} sx={{ border: "1px solid #f0f0f0", borderRadius: 2 }}>
            <KeyboardBackspaceIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a2e" }}>
            Partner Login
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
            Sign in to manage your services
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          )}

          <form onSubmit={handleLogin}>
            {/* Service Category */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                SERVICE CATEGORY
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="serviceCategory"
                  value={loginData.serviceCategory}
                  onChange={handleChange}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon sx={{ fontSize: 20, color: "#cbd5e1" }} />
                    </InputAdornment>
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      pl: 1
                    }
                  }}
                >
                  <MenuItem value="" disabled>Select your service</MenuItem>
                  <MenuItem value="AC Repair">AC Repair & Service</MenuItem>
                  <MenuItem value="Plumbing">Plumbing Services</MenuItem>
                  <MenuItem value="Electrical">Electrical Services</MenuItem>
                  <MenuItem value="Cleaning">Home Cleaning</MenuItem>
                  <MenuItem value="Carpentry">Carpentry Services</MenuItem>
                  <MenuItem value="Painting">Painting Services</MenuItem>
                  <MenuItem value="Pest Control">Pest Control</MenuItem>
                  <MenuItem value="Salon">Salon & Spa</MenuItem>
                  <MenuItem value="Appliance Repair">Appliance Repair</MenuItem>
                  <MenuItem value="Gardening">Gardening Services</MenuItem>
                  <MenuItem value="Moving">Packers & Movers</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                EMAIL
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={handleChange}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 20, color: "#cbd5e1" }} /></InputAdornment>
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                PASSWORD
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ fontSize: 20, color: "#cbd5e1" }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                py: 1.5,
                bgcolor: "#4f46e5",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Typography sx={{ mt: 1, textAlign: 'center', fontSize: '0.85rem' }}>
              <Box component="span" onClick={() => navigate("/provider/forgot-password")} 
                   sx={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600, textDecoration: 'underline' }}>
                Forgot Password?
              </Box>
            </Typography>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">OR</Typography>
            </Divider>

            <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: "#666" }}>
              New partner?{" "}
              <Box component="span" onClick={() => navigate("/provider/register")} 
                   sx={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}>
                Register now
              </Box>
            </Typography>
          </form>
        </Box>
      </Box>

      {/* RIGHT GRAPHIC PANEL */}
      <Box sx={{
        flex: 1,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        p: 6
      }}>
        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '40%', bgcolor: 'rgba(255,255,255,0.08)', top: -150, right: -150 }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', bottom: -50, left: -50 }} />
        
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 400, textAlign: "center" }}>
          <VerifiedUserIcon sx={{ fontSize: 80, color: "#fff", mb: 3, opacity: 0.9 }} />
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
            Welcome Back, Partner
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", mb: 4, lineHeight: 1.7 }}>
            Access your dashboard to manage bookings, view earnings, and grow your business with Fixora.
          </Typography>
          
          <Box sx={{ 
            bgcolor: "rgba(255,255,255,0.1)", 
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            p: 3,
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>
              "Fixora helped me grow my plumbing business by 200% in just 6 months. The platform is easy to use and customers are great!"
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mt: 2 }}>
              <Box sx={{ width: 32, height: 32, bgcolor: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#4f46e5" }}>RK</Typography>
              </Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>Rajesh Kumar</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Plumbing Services, Mumbai</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Pending Approval Dialog */}
      {showPendingDialog && (
        <Box sx={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 420, textAlign: "center", mx: 2 }}>
            <Box sx={{ 
              width: 80, height: 80, 
              bgcolor: "#fff3e0", 
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3
            }}>
              <AccessTimeIcon sx={{ fontSize: 48, color: "#ff9800" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Account Under Review
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your provider account is currently being verified by our team.
            </Typography>
            <Box sx={{ 
              bgcolor: "#fff3e0", 
              border: "1px solid #ff9800",
              borderRadius: 2,
              p: 2,
              mb: 3
            }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#e65100" }}>
                ⏳ Verification in Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your documents are under review. You'll receive access to the dashboard once approved by admin. This usually takes 24-48 hours.
              </Typography>
            </Box>
            <Button
              onClick={handlePendingDialogClose}
              variant="contained"
              fullWidth
              sx={{ 
                bgcolor: "#ff9800",
                py: 1.5,
                fontWeight: 600,
                "&:hover": { bgcolor: "#f57c00" }
              }}
            >
              OK
            </Button>
          </Paper>
        </Box>
      )}

      {/* Welcome Dialog - First Login After Approval */}
      <Dialog
        open={showWelcomeDialog}
        onClose={handleWelcomeDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <Box sx={{ 
            width: 100, height: 100, 
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)"
          }}>
            <CelebrationIcon sx={{ fontSize: 56, color: "#fff" }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a2e" }}>
            Congratulations, {providerName}! 🎉
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#10b981" }}>
            Your Account Has Been Verified!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Welcome to Fixora! Your provider account has been approved and verified. 
            You now have full access to your dashboard where you can manage bookings, 
            track earnings, and grow your service business.
          </Typography>
          
          <Box sx={{ 
            bgcolor: "#f0fdf4", 
            border: "1px solid #10b981",
            borderRadius: 2,
            p: 2,
            mb: 3,
            textAlign: "left"
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#166534", mb: 1 }}>
              What's next?
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li><Typography variant="body2" color="text.secondary">Complete your profile and add your services</Typography></li>
              <li><Typography variant="body2" color="text.secondary">Add your bank details for payments</Typography></li>
              <li><Typography variant="body2" color="text.secondary">Start receiving booking requests!</Typography></li>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
          <Button
            onClick={handleWelcomeDialogClose}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              bgcolor: "#10b981",
              px: 4,
              py: 1.5,
              fontWeight: 700,
              "&:hover": { bgcolor: "#059669" }
            }}
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderLogin;
