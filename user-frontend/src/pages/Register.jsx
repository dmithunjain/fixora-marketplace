import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleIcon from "@mui/icons-material/Google";
import { AuthContext } from "../context/AuthContext";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!isValidEmail(value)) return "Please enter a valid email address";
        return "";
      case "phone":
        if (!value) return "Mobile number is required";
        if (!isValidPhone(value)) return "Please enter a valid 10-digit mobile number (starting with 6-9)";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const formatted = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: formatted });
      if (touched[name]) {
        setErrors({ ...errors, [name]: validateField(name, formatted) });
      }
    } else {
      setForm({ ...form, [name]: value });
      if (touched[name]) {
        setErrors({ ...errors, [name]: validateField(name, value) });
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleRegister = async () => {
    const newErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      phone: validateField("phone", form.phone),
      password: validateField("password", form.password)
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, password: true });

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;

    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFieldValid = (name) => touched[name] && !errors[name] && form[name];
  const isFieldInvalid = (name) => touched[name] && errors[name];

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",
      width: "100vw",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* LEFT SIDE: CLEAN FORM */}
      <Box sx={{
        flex: 1,
        p: { xs: 3, md: 8 },
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        position: 'relative',
        zIndex: 1,
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        
        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
          <IconButton 
            onClick={() => navigate("/")} 
            sx={{ 
              border: "1px solid #e5e7eb", 
              borderRadius: 2,
              color: "#6b7280",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "#f3f4f6",
                borderColor: "#d1d5db"
              }
            }}
          >
            <KeyboardBackspaceIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 500, color: "#6b7280" }}>
            Already have an account? 
            <Box 
              component="span" 
              onClick={() => navigate("/login")} 
              sx={{ 
                color: "#4f46e5", 
                cursor: "pointer", 
                ml: 1,
                fontWeight: 600,
                "&:hover": { textDecoration: 'underline' }
              }}
            >
              Sign in
            </Box>
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 420, mx: "auto", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>
            Create Account
          </Typography>
          <Typography sx={{ mb: 4, color: "#6b7280", fontSize: "0.95rem" }}>
            Join Fixora for premium home services
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Name Field */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block', color: '#374151', letterSpacing: "0.3px" }}>
              FULL NAME
            </Typography>
            <TextField
              fullWidth
              name="name"
              placeholder="e.g. Daniel Ahmadi"
              variant="outlined"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid("name")}
              helperText={isFieldInvalid("name") ? errors.name : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused": { 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: isFieldInvalid("name") ? "#dc2626" : "#9ca3af", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: isFieldValid("name") && (
                  <InputAdornment position="end">
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: 18 }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Email Field */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block', color: '#374151', letterSpacing: "0.3px" }}>
              EMAIL ADDRESS
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="name@company.com"
              variant="outlined"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid("email")}
              helperText={isFieldInvalid("email") ? errors.email : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused": { 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ color: isFieldInvalid("email") ? "#dc2626" : "#9ca3af", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: isFieldValid("email") && (
                  <InputAdornment position="end">
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: 18 }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Phone Field */}
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block', color: '#374151', letterSpacing: "0.3px" }}>
              MOBILE NUMBER
            </Typography>
            <TextField
              fullWidth
              name="phone"
              placeholder="Enter 10-digit mobile number"
              variant="outlined"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid("phone")}
              helperText={isFieldInvalid("phone") ? errors.phone : "Must be 10 digits, starting with 6-9"}
              inputProps={{ maxLength: 10 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused": { 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: isFieldInvalid("phone") ? "#dc2626" : "#9ca3af", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: isFieldValid("phone") && (
                  <InputAdornment position="end">
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: 18 }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block', color: '#374151', letterSpacing: "0.3px" }}>
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              variant="outlined"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={isFieldInvalid("password")}
              helperText={isFieldInvalid("password") ? errors.password : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused": { 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon sx={{ color: isFieldInvalid("password") ? "#dc2626" : "#9ca3af", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                      {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleRegister}
              disabled={loading}
              sx={{
                bgcolor: "#4f46e5",
                borderRadius: 2,
                px: 4,
                py: 1.8,
                textTransform: "none",
                fontWeight: 600,
                fontSize: '1rem',
                "&:hover": { bgcolor: '#4338ca' }
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>Or</Typography>
            <Box display="flex" gap={1.5}>
              <IconButton 
                sx={{ 
                  border: "1px solid #e5e7eb", 
                  p: 1.2,
                  "&:hover": { background: "#f3f4f6" }
                }}
              >
                <GoogleIcon sx={{ color: "#ea4335", fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT SIDE: ANIMATED DECORATIONS */}
      <Box sx={{
        flex: 1,
        display: { xs: "none", lg: "flex" },
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Circles */}
        <Box sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "-15%",
          left: "-10%",
          animation: "circleFloat1 9s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(240, 147, 251, 0.25)",
          bottom: "5%",
          right: "-5%",
          animation: "circleFloat2 11s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.12)",
          top: "45%",
          left: "10%",
          animation: "circleFloat3 7s ease-in-out infinite"
        }} />

        {/* Animated Squares */}
        <Box sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "2px solid rgba(255, 255, 255, 0.15)",
          top: "10%",
          right: "15%",
          transform: "rotate(20deg)",
          animation: "squareRotate 14s linear infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 140,
          height: 140,
          borderRadius: "18px",
          background: "rgba(102, 126, 234, 0.25)",
          bottom: "15%",
          left: "5%",
          transform: "rotate(-15deg)",
          animation: "squareRotate2 12s linear infinite reverse"
        }} />
        <Box sx={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "14px",
          background: "rgba(255, 255, 255, 0.1)",
          top: "55%",
          right: "10%",
          animation: "squareBounce 6s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 70,
          height: 70,
          borderRadius: "12px",
          background: "rgba(240, 147, 251, 0.2)",
          top: "25%",
          left: "20%",
          animation: "squareBounce2 8s ease-in-out infinite"
        }} />

        {/* Small floating elements */}
        <Box sx={{
          position: "absolute",
          width: 24,
          height: 24,
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.25)",
          top: "20%",
          left: "35%",
          animation: "floatSmall 4s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          bottom: "30%",
          right: "25%",
          animation: "floatSmall2 5s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 28,
          height: 28,
          borderRadius: "10px",
          background: "rgba(102, 126, 234, 0.35)",
          top: "65%",
          left: "25%",
          animation: "floatSmall3 6s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 14,
          height: 14,
          borderRadius: "4px",
          background: "rgba(244, 114, 182, 0.3)",
          top: "40%",
          right: "30%",
          animation: "floatSmall4 7s ease-in-out infinite"
        }} />

        {/* Center Content Cards */}
        <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 360 }}>
          
          {/* Stats Card */}
          <Box sx={{ 
            p: 3.5, 
            borderRadius: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
          }}>
            <Typography variant="caption" sx={{ color: "#c4b5fd", fontWeight: 700, letterSpacing: "1px" }}>
              ACTIVE BOOKINGS
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 1.5, color: "white" }}>
              14,290+
            </Typography>
            <Box sx={{ height: 6, width: '100%', bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                height: '100%', 
                width: '75%', 
                background: "linear-gradient(90deg, #a78bfa, #f472b6)",
                borderRadius: 3 
              }} />
            </Box>
            <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: "rgba(255,255,255,0.8)" }}>
              Verified professionals nearby
            </Typography>
          </Box>

          {/* Feature Card */}
          <Box sx={{ 
            p: 3.5, 
            borderRadius: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(15px)',
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            ml: 5
          }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.15)', borderRadius: 2 }}>
                <Typography sx={{fontSize: 26}}>🏠</Typography>
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={800} sx={{ color: "white" }}>Smart Home Care</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>Automated scheduling.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ height: 8, width: 50, background: "linear-gradient(90deg, #a78bfa, #f472b6)", borderRadius: 4 }} />
              <Box sx={{ height: 8, width: 70, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
            </Box>
          </Box>

          {/* Trust Badge */}
          <Box sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: "1px solid rgba(255, 255, 255, 0.15)",
            textAlign: "center",
            ml: -3
          }}>
            <Box sx={{ fontSize: 28, mb: 1 }}>🛡️</Box>
            <Typography variant="body2" fontWeight={700} sx={{ color: "#86efac" }}>
              100% Secure
            </Typography>
          </Box>
        </Box>

        <style>
          {`
            @keyframes circleFloat1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(40px, 40px) scale(1.1); }
            }
            @keyframes circleFloat2 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(-50px, -30px) rotate(180deg); }
            }
            @keyframes circleFloat3 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(30px, -40px); }
            }
            @keyframes squareRotate {
              from { transform: rotate(20deg); }
              to { transform: rotate(380deg); }
            }
            @keyframes squareRotate2 {
              from { transform: rotate(-15deg); }
              to { transform: rotate(345deg); }
            }
            @keyframes squareBounce {
              0%, 100% { transform: translateY(0) rotate(20deg); }
              50% { transform: translateY(-30px) rotate(30deg); }
            }
            @keyframes squareBounce2 {
              0%, 100% { transform: translateY(0) rotate(15deg); }
              50% { transform: translateY(-25px) rotate(-5deg); }
            }
            @keyframes floatSmall {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.25; }
              50% { transform: translate(20px, -20px) rotate(45deg); opacity: 0.5; }
            }
            @keyframes floatSmall2 {
              0%, 100% { transform: translate(0, 0); opacity: 0.2; }
              50% { transform: translate(-15px, 15px); opacity: 0.4; }
            }
            @keyframes floatSmall3 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.35; }
              50% { transform: translate(25px, -15px) rotate(-30deg); opacity: 0.6; }
            }
            @keyframes floatSmall4 {
              0%, 100% { transform: translate(0, 0); opacity: 0.3; }
              50% { transform: translate(-20px, 20px); opacity: 0.5; }
            }
          `}
        </style>
      </Box>
    </Box>
  );
}
