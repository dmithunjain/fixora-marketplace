import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProfileSkeleton } from "../components/SkeletonLoader";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

const DISTRICT_DATA = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Thane"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"]
};

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [locationEditOpen, setLocationEditOpen] = useState(false);
  const [editLocation, setEditLocation] = useState({ state: "", district: "", city: "", pincode: "" });

  useEffect(() => {
    const savedLocation = localStorage.getItem('fixoraLocation');
    let location = { city: "", state: "", district: "", pincode: "" };
    
    if (savedLocation) {
      try {
        location = JSON.parse(savedLocation);
      } catch (e) {
        console.error("Error parsing location:", e);
      }
    }

    const timer = setTimeout(() => {
      setProfile({
        name: user?.name || "John Doe",
        email: user?.email || "john.doe@example.com",
        phone: user?.phone || "+91 9876543210",
        avatar: user?.avatar || null,
        verified: true,
        memberSince: "January 2024",
        location: location
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [user]);

  const handleOpenLocationEdit = () => {
    const current = profile?.location || {};
    setEditLocation({
      state: current.state || "",
      district: current.district || "",
      city: current.city || "",
      pincode: current.pincode || ""
    });
    setLocationEditOpen(true);
  };

  const handleSaveLocation = () => {
    const newLocation = {
      state: editLocation.state,
      district: editLocation.district,
      city: editLocation.city,
      pincode: editLocation.pincode
    };
    localStorage.setItem('fixoraLocation', JSON.stringify(newLocation));
    setProfile({ ...profile, location: newLocation });
    setLocationEditOpen(false);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <Box sx={{ background: "#f8f9ff", minHeight: "100vh", py: 4 }}>
      <Box sx={{ px: { xs: 2, md: 8 }}}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            My Profile
          </Typography>
          <Typography sx={{ color: "#6b7280" }}>
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Profile Header Card */}
        <Card sx={{ borderRadius: "16px", mb: 4, overflow: "hidden" }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              p: 4,
              textAlign: "center"
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                fontSize: 48,
                fontWeight: 700,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "4px solid white"
              }}
            >
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: 700, mb: 1 }}
            >
              {profile?.name || "User"}
            </Typography>
            {profile?.verified && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  background: "rgba(255,255,255,0.2)",
                  px: 2,
                  py: 0.5,
                  borderRadius: "9999px",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                <VerifiedIcon sx={{ fontSize: 14 }} /> Verified Account
              </Box>
            )}
            <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 1, fontSize: 14 }}>
              Member since {profile?.memberSince}
            </Typography>
          </Box>

          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                p: 3,
                borderBottom: "1px solid #e5e7eb"
              }}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate("/edit-profile")}
                sx={{ borderRadius: "8px" }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/change-password")}
                sx={{ borderRadius: "8px" }}
              >
                Change Password
              </Button>
            </Box>

            {/* Profile Details */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 3,
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#ecfdf5" }}>
                      <PersonIcon sx={{ color: "#059669" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600 }}>
                        Full Name
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {profile?.name || "Not set"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 3,
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#dbeafe" }}>
                      <EmailIcon sx={{ color: "#2563eb" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600 }}>
                        Email Address
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {profile?.email || "Not set"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 3,
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#f5f3ff" }}>
                      <PhoneIcon sx={{ color: "#7c3aed" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600 }}>
                        Phone Number
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {profile?.phone || "Not set"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 3,
                      bgcolor: "#f9fafb",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#fffbeb" }}>
                      <LocationOnIcon sx={{ color: "#d97706" }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600 }}>
                        Location
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {profile?.location?.city ? `${profile.location.city}, ` : ""}
                        {profile?.location?.district ? `${profile.location.district}, ` : ""}
                        {profile?.location?.state || "Not set"}
                        {profile?.location?.pincode ? ` - ${profile.location.pincode}` : ""}
                      </Typography>
                    </Box>
                    <Button size="small" onClick={handleOpenLocationEdit}>
                      <EditIcon fontSize="small" />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ borderRadius: "16px" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "My Bookings", path: "/bookings", icon: "📅" },
                { label: "My Reviews", path: "/reviews", icon: "⭐" },
                { label: "Support", path: "/support", icon: "🎧" },
                { label: "Notifications", path: "/notifications", icon: "🔔" }
              ].map((action, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Box
                    onClick={() => navigate(action.path)}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#4f46e5",
                        background: "#eff6ff"
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: 32, mb: 1 }}>{action.icon}</Typography>
                    <Typography sx={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>
                      {action.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Dialog open={locationEditOpen} onClose={() => setLocationEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={editLocation.state}
                  label="State"
                  onChange={(e) => setEditLocation({ state: e.target.value, district: "", city: "" })}
                >
                  {INDIAN_STATES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  value={editLocation.district}
                  label="District"
                  onChange={(e) => setEditLocation({ ...editLocation, district: e.target.value })}
                >
                  {(DISTRICT_DATA[editLocation.state] || []).map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="City"
                value={editLocation.city}
                onChange={(e) => setEditLocation({ ...editLocation, city: e.target.value })}
                fullWidth
              />
              <TextField
                label="Pincode"
                value={editLocation.pincode}
                onChange={(e) => setEditLocation({ ...editLocation, pincode: e.target.value })}
                fullWidth
                inputProps={{ maxLength: 6 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLocationEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLocation} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
