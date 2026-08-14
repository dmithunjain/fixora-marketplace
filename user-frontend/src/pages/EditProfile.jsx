import { useState, useEffect, useContext } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { userAPI } from "../services/api";

export default function EditProfile(){
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      await userAPI.updateProfile({ name, phone, email });
      updateUser({ name, phone, email });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return(
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #f8fafc 0%, #f3f6fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Box sx={{ 
        maxWidth: 500, 
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
          p: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
            Edit Profile
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', mt: 0.5 }}>
            Update your personal information
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Profile updated successfully!
            </Alert>
          )}

          <TextField
            label="Full Name"
            fullWidth
            sx={{ mb: 3 }}
            value={name}
            onChange={(e)=>setName(e.target.value)}
            variant="outlined"
          />

          <TextField
            label="Phone Number"
            fullWidth
            sx={{ mb: 3 }}
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            variant="outlined"
          />

          <TextField
            label="Email Address"
            fullWidth
            sx={{ mb: 3 }}
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            inputProps={{ readOnly: true }}
            variant="outlined"
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate("/profile")}
              sx={{ 
                flex: 1,
                py: 1.5,
                borderColor: '#e5e7eb',
                color: '#6b7280',
                '&:hover': { borderColor: '#d1d5db', background: '#f9fafb' }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={loading}
              sx={{ 
                flex: 1,
                py: 1.5,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' }
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}