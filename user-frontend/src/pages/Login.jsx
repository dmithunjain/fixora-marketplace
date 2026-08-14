import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, TextField, Button, IconButton, Divider, InputAdornment, Alert 
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import GoogleIcon from "@mui/icons-material/Google";
import { AuthContext } from "../context/AuthContext";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!isValidEmail(value)) return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleLogin = async () => {
    const newErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password)
    };
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;

    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

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
        <IconButton 
          onClick={() => navigate("/")}
          sx={{ 
            alignSelf: 'flex-start', 
            border: '1px solid #e5e7eb', 
            mb: 6,
            color: "#6b7280",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#f3f4f6",
              borderColor: "#d1d5db"
            }
          }}
        >
          <KeyboardBackspaceIcon />
        </IconButton>

        <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>
            Welcome Back
          </Typography>
          <Typography sx={{ mb: 4, color: "#6b7280", fontSize: "0.95rem" }}>
            Sign in to continue to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<GoogleIcon />}
            sx={{ 
              py: 1.5, 
              borderRadius: 2, 
              color: '#374151', 
              borderColor: '#e5e7eb',
              mb: 3, 
              textTransform: 'none', 
              fontWeight: 600,
              "&:hover": {
                borderColor: "#9ca3af",
                background: "#f9fafb"
              }
            }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.85rem", fontWeight: 500 }}>
              or sign in with email
            </Typography>
          </Divider>

          {/* Email Field */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block', color: '#374151', letterSpacing: "0.3px" }}>
              EMAIL ADDRESS
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="Enter your email"
              variant="outlined"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              error={isFieldInvalid("email")}
              helperText={isFieldInvalid("email") ? errors.email : ""}
              sx={{ 
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused": { 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                  }
                }
              }}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ color: isFieldInvalid("email") ? "#dc2626" : '#9ca3af' }} />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: 'block', color: '#374151', letterSpacing: "0.3px" }}>
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              variant="outlined"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              error={isFieldInvalid("password")}
              helperText={isFieldInvalid("password") ? errors.password : ""}
              sx={{ 
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused": { 
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                  }
                }
              }}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon sx={{ color: isFieldInvalid("password") ? "#dc2626" : '#9ca3af' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{ 
              py: 1.8, 
              borderRadius: 2, 
              background: "#4f46e5", 
              fontWeight: 600, 
              fontSize: "1rem",
              textTransform: "none",
              "&:hover": {
                background: "#4338ca"
              }
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <Typography sx={{ mt: 3, textAlign: 'center', fontSize: '0.95rem', color: "#6b7280" }}>
            Don't have an account?{" "}
            <Box
              component="span"
              onClick={() => navigate("/register")}
              sx={{ 
                color: "#4f46e5", 
                cursor: "pointer", 
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" }
              }}
            >
              Sign up
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE: ANIMATED DECORATIONS */}
      <Box sx={{ 
        flex: 1, 
        display: { xs: 'none', lg: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Circles */}
        <Box sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "-10%",
          right: "-5%",
          animation: "circleFloat1 8s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(240, 147, 251, 0.3)",
          bottom: "10%",
          left: "-10%",
          animation: "circleFloat2 10s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          top: "50%",
          left: "20%",
          animation: "circleFloat3 6s ease-in-out infinite"
        }} />

        {/* Animated Squares */}
        <Box sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          top: "15%",
          left: "10%",
          transform: "rotate(15deg)",
          animation: "squareRotate 12s linear infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "16px",
          background: "rgba(102, 126, 234, 0.3)",
          bottom: "20%",
          right: "15%",
          transform: "rotate(-20deg)",
          animation: "squareRotate2 10s linear infinite reverse"
        }} />
        <Box sx={{
          position: "absolute",
          width: 80,
          height: 80,
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.12)",
          top: "60%",
          right: "25%",
          animation: "squareBounce 5s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 60,
          height: 60,
          borderRadius: "10px",
          background: "rgba(240, 147, 251, 0.25)",
          top: "30%",
          right: "20%",
          animation: "squareBounce2 7s ease-in-out infinite"
        }} />

        {/* Small floating elements */}
        <Box sx={{
          position: "absolute",
          width: 20,
          height: 20,
          borderRadius: "6px",
          background: "rgba(255, 255, 255, 0.3)",
          top: "25%",
          left: "40%",
          animation: "floatSmall 4s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.25)",
          bottom: "35%",
          right: "30%",
          animation: "floatSmall2 5s ease-in-out infinite"
        }} />
        <Box sx={{
          position: "absolute",
          width: 24,
          height: 24,
          borderRadius: "8px",
          background: "rgba(102, 126, 234, 0.4)",
          top: "70%",
          left: "30%",
          animation: "floatSmall3 6s ease-in-out infinite"
        }} />

        {/* Center Content Card */}
        <Box sx={{
          p: 4, 
          borderRadius: 4, 
          bgcolor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: "1px solid rgba(255, 255, 255, 0.3)",
          maxWidth: 340,
          textAlign: "center",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)"
        }}>
          <Box sx={{ fontSize: 56, mb: 2 }}>🔐</Box>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 1.5, color: "white" }}>
            Secure Access
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            Your personal gateway to all home services and bookings.
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 1.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#a78bfa" }} />
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f472b6" }} />
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#818cf8" }} />
          </Box>
        </Box>

        <style>
          {`
            @keyframes circleFloat1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-30px, 30px) scale(1.1); }
            }
            @keyframes circleFloat2 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(40px, -20px) rotate(180deg); }
            }
            @keyframes circleFloat3 {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-20px, -30px); }
            }
            @keyframes squareRotate {
              from { transform: rotate(15deg); }
              to { transform: rotate(375deg); }
            }
            @keyframes squareRotate2 {
              from { transform: rotate(-20deg); }
              to { transform: rotate(340deg); }
            }
            @keyframes squareBounce {
              0%, 100% { transform: translateY(0) rotate(15deg); }
              50% { transform: translateY(-25px) rotate(25deg); }
            }
            @keyframes squareBounce2 {
              0%, 100% { transform: translateY(0) rotate(15deg); }
              50% { transform: translateY(-20px) rotate(-5deg); }
            }
            @keyframes floatSmall {
              0%, 100% { transform: translate(0, 0); opacity: 0.3; }
              50% { transform: translate(15px, -15px); opacity: 0.6; }
            }
            @keyframes floatSmall2 {
              0%, 100% { transform: translate(0, 0); opacity: 0.25; }
              50% { transform: translate(-10px, 10px); opacity: 0.5; }
            }
            @keyframes floatSmall3 {
              0%, 100% { transform: translate(0, 0); opacity: 0.4; }
              50% { transform: translate(20px, -10px); opacity: 0.7; }
            }
          `}
        </style>
      </Box>
    </Box>
  );
}
