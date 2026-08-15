import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, TextField, Button, CircularProgress, 
Alert, Paper, InputAdornment, IconButton
} from "@mui/material";
import { providerAPI } from "../../services/api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const ProviderRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaar: "",
    pan: "",
    serviceCategory: "",
    experience: "",
    city: "",
    pincode: "",
    password: "",
    certificate: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, certificate: file });
    }
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.serviceCategory) {
      setError("Please select a service category");
      return false;
    }
    if (formData.aadhaar && formData.aadhaar.length !== 12) {
      setError("Aadhaar number must be 12 digits");
      return false;
    }
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(formData.pan)) {
      setError("Invalid PAN format (e.g., ABCDE1234F)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("aadhaar", formData.aadhaar);
      submitData.append("pan", formData.pan);
      submitData.append("serviceCategory", formData.serviceCategory);
      submitData.append("experience", formData.experience);
      submitData.append("city", formData.city);
      submitData.append("pincode", formData.pincode);
      submitData.append("password", formData.password);
      if (formData.certificate) {
        submitData.append("certificate", formData.certificate);
      }

      await providerAPI.register(submitData);
      setSuccessDialog(true);
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (Array.isArray(err.response?.data?.errors)) {
        errorMessage = err.response.data.errors.map(e => e.msg).join('. ');
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setSuccessDialog(false);
    navigate("/provider/login");
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
        overflow: "auto"
      }}>
        {/* TOP NAV */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <IconButton onClick={() => navigate("/")} sx={{ border: "1px solid #f0f0f0", borderRadius: 2 }}>
            <KeyboardBackspaceIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
            Already a partner? 
            <Box component="span" onClick={() => navigate("/provider/login")} 
                 sx={{ color: "#4f46e5", cursor: "pointer", fontWeight: 700, ml: 1 }}>
              Sign in
            </Box>
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 480, mx: "auto", width: "100%" }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1a1a2e", letterSpacing: '-0.5px' }}>
              Partner with Fixora
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              Join our network of verified service professionals
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {/* Full Name */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  FULL NAME *
                </Typography>
                <TextField
                  fullWidth
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 20, color: "#cbd5e1" }} /></InputAdornment>,
                    endAdornment: formData.fullName && <InputAdornment position="end"><CheckCircleIcon sx={{ fontSize: 18, color: "#10b981" }} /></InputAdornment>
                  }}
                />
              </Box>

              {/* Phone */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  PHONE NUMBER *
                </Typography>
                <TextField
                  fullWidth
                  name="phone"
                  placeholder="XXXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: value });
                  }}
                  required
                  size="small"
                  inputProps={{ maxLength: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      '&:hover': { backgroundColor: "#f5f5ff" },
                      '&.Mui-focused': {
                        backgroundColor: "#fff",
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: "#4f46e5",
                          borderWidth: "2px"
                        }
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: "10px", 
                          background: "linear-gradient(135deg, #dcfce7 0%, #fff 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <PhoneIcon sx={{ fontSize: 18, color: "#16a34a" }} />
                        </Box>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  EMAIL *
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 20, color: "#cbd5e1" }} /></InputAdornment>
                  }}
                />
              </Box>

              {/* Aadhaar */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  AADHAAR NUMBER
                </Typography>
                <TextField
                  fullWidth
                  name="aadhaar"
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadhaar}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setFormData({ ...formData, aadhaar: value });
                  }}
                  size="small"
                  inputProps={{ maxLength: 12 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      '&:hover': { backgroundColor: "#f5f5ff" },
                      '&.Mui-focused': {
                        backgroundColor: "#fff",
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: "#4f46e5",
                          borderWidth: "2px"
                        }
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: "10px", 
                          background: "linear-gradient(135deg, #fef3f2 0%, #fff 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <BadgeIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                        </Box>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* PAN */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  PAN NUMBER
                </Typography>
                <TextField
                  fullWidth
                  name="pan"
                  placeholder="ABCDE1234F"
                  value={formData.pan}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ fontSize: 20, color: "#cbd5e1" }} /></InputAdornment>
                  }}
                />
              </Box>

              {/* Service Category */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  SERVICE CATEGORY *
                </Typography>
                <TextField
                  fullWidth
                  select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  required
                  size="small"
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      '&:hover': {
                        backgroundColor: "#f5f5ff",
                      },
                      '&.Mui-focused': {
                        backgroundColor: "#fff",
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: "#4f46e5",
                          borderWidth: "2px"
                        }
                      }
                    },
                    '& .MuiSelect-select': {
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: "10px", 
                          background: "linear-gradient(135deg, #e8e4ff 0%, #f0f0ff 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <WorkIcon sx={{ fontSize: 18, color: "#4f46e5" }} />
                        </Box>
                      </InputAdornment>
                    )
                  }}
                >
                  <option value="">Select your service category</option>
                  <option value="AC Repair">AC Repair & Service</option>
                  <option value="Plumbing">Plumbing Services</option>
                  <option value="Electrical">Electrical Services</option>
                  <option value="Cleaning">Home Cleaning</option>
                  <option value="Carpentry">Carpentry Services</option>
                  <option value="Painting">Painting Services</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Salon">Salon & Spa</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Gardening">Gardening Services</option>
                  <option value="Moving">Packers & Movers</option>
                </TextField>
              </Box>

              {/* Experience */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  EXPERIENCE (YEARS)
                </Typography>
                <TextField
                  fullWidth
                  name="experience"
                  placeholder="e.g., 3"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ min: 0, max: 50 }}
                />
              </Box>

              {/* City */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  CITY
                </Typography>
                <TextField
                  fullWidth
                  name="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ fontSize: 20, color: "#cbd5e1" }} /></InputAdornment>
                  }}
                />
              </Box>

              {/* Pincode */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  PINCODE
                </Typography>
                <TextField
                  fullWidth
                  name="pincode"
                  placeholder="XXXXXX"
                  value={formData.pincode}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ maxLength: 6 }}
                />
              </Box>

              {/* Password */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  PASSWORD *
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

              {/* Certificate Upload */}
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block', color: '#333' }}>
                  UPLOAD CERTIFICATE (ID Proof / Experience Certificate)
                </Typography>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: formData.certificate ? "#f0fdf4" : "#fafafa",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#4f46e5", bgcolor: "#f5f5ff" }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                  />
                  {formData.certificate ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 500 }}>
                        {formData.certificate.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <UploadFileIcon sx={{ fontSize: 32, color: "#cbd5e1", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF, JPG, PNG (max 5MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: "#4f46e5",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              {loading ? "Creating Account..." : "Register as Partner"}
            </Button>
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
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '40%', bgcolor: 'rgba(255,255,255,0.08)', top: -150, right: -150 }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', bottom: -50, left: -50 }} />
        
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 400, textAlign: "center" }}>
          <VerifiedUserIcon sx={{ fontSize: 80, color: "#fff", mb: 3, opacity: 0.9 }} />
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, mb: 2 }}>
            Become a Fixora Partner
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", mb: 4, lineHeight: 1.7 }}>
            Join thousands of verified service professionals earning with Fixora. Get access to customer bookings, manage your schedule, and grow your business.
          </Typography>
          
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#fff", fontWeight: 800 }}>10K+</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Active Partners</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#fff", fontWeight: 800 }}>50K+</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Jobs Completed</Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ color: "#fff", fontWeight: 800 }}>4.8</Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>Avg Rating</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Success Dialog */}
      {successDialog && (
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
              bgcolor: "#fef3c7", 
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3
            }}>
              <VerifiedUserIcon sx={{ fontSize: 48, color: "#f59e0b" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Registration Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your account has been created. Please wait for admin verification.
            </Typography>
            <Box sx={{ 
              bgcolor: "#fffbeb", 
              border: "1px solid #f59e0b",
              borderRadius: 2,
              p: 2,
              mb: 3
            }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#92400e", display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                ⏳ Verification Pending
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your documents will be verified within 24-48 hours. You'll be notified once approved.
              </Typography>
            </Box>
            <Button
              onClick={handleDialogClose}
              variant="contained"
              fullWidth
              sx={{ 
                bgcolor: "#4f46e5",
                py: 1.5,
                fontWeight: 600,
                "&:hover": { bgcolor: "#4338ca" }
              }}
            >
              Go to Login
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ProviderRegister;
