import { Box, Typography, Button, Grid, TextField, Chip, Divider, Skeleton, Paper, Container, IconButton, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import ServiceReviews from "../components/ServiceReviews";
import { ServiceDetailSkeleton } from "../components/SkeletonLoader";
import { publicServiceAPI, bookingAPI } from "../services/api";
import { mapService } from "../utils/serviceMapper";
import { services as staticServices } from "../data/services";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LoopIcon from "@mui/icons-material/Loop";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [cartSnackbar, setCartSnackbar] = useState({ open: false, message: "" });

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError("");
      try {
        const numericId = parseInt(id, 10);

        // If URL is numeric (e.g. /service/6), first check placement-driven page content.
        if (!isNaN(numericId)) {
          try {
            const pageRes = await publicServiceAPI.getServicesByPage(String(numericId));
            const pagePayload = pageRes?.data || pageRes;
            if (pagePayload?.services?.length > 0) {
              const mappedPlacedService = mapService(pagePayload.services[0]);
              if (mappedPlacedService) {
                setService(mappedPlacedService);
                return;
              }
            }
          } catch (pageErr) {
            console.log("Page placement lookup failed:", pageErr.message);
          }
        }

        const data = await publicServiceAPI.getServiceById(id);
        const payload = data?.data || data;
        if (payload) {
          const mappedService = mapService(payload);
          setService(mappedService);
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.log("Backend fetch failed, trying static services:", err.message);
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          const staticService = staticServices.find(s => s.id === numericId);
          if (staticService) {
            setService(staticService);
          } else {
            setError("Service not found");
          }
        } else {
          setError("Service not found");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("fixoraWishlist") || "[]");
    setIsWishlisted(stored.includes(String(id)));
  }, [id]);

  // Check if user can review (has completed booking for this service)
  useEffect(() => {
    const checkCanReview = async () => {
      if (!user || !service?._id) {
        setCanReview(false);
        return;
      }
      try {
        const bookingsRes = await bookingAPI.getUserBookings();
        const completedBookings = bookingsRes.data.filter(
          b => b.status === 'completed' && 
          (String(b.service?._id) === String(service._id) || String(b.service) === String(service._id))
        );
        setCanReview(completedBookings.length > 0);
      } catch (err) {
        setCanReview(false);
      }
    };
    checkCanReview();
  }, [user, service?._id]);

  const handleBookNow = () => {
    if (!service) return;
    navigate(`/checkout/${service._id || service.id}`, { state: { date: selectedDate, time: selectedTime } });
  };

  const handleAddToCart = () => {
    if (!service) return;
    addToCart({
      cartId: String(service._id || service.id),
      id: String(service._id || service.id),
      _id: service._id || service.id,
      name: service.title || service.name,
      title: service.title || service.name,
      image: service.images?.[0] || service.image,
      price: Number(service.price || 0),
      category: service.category
    });
    setCartSnackbar({ open: true, message: `${service.name || service.title} added to cart!` });
  };

  const toggleWishlist = () => {
    const stored = JSON.parse(localStorage.getItem("fixoraWishlist") || "[]");
    const key = String(id);
    const next = stored.includes(key) ? stored.filter((item) => item !== key) : [...stored, key];
    localStorage.setItem("fixoraWishlist", JSON.stringify(next));
    setIsWishlisted(next.includes(key));
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#f8f9ff", minHeight: "100vh", pt: { xs: 10, md: 12 }, pb: 4 }}>
        <Container maxWidth="lg">
          <ServiceDetailSkeleton />
        </Container>
      </Box>
    );
  }

  if (error || !service) {
    return (
      <Box sx={{ p: 6, textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Service not found</Typography>
          <Button variant="contained" onClick={() => navigate("/services")}>Browse Services</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f1f3f6", minHeight: "100vh", pt: { xs: 10, md: 12 }, pb: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", borderRadius: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <ArrowBackIcon fontSize="small" sx={{ color: "#212121" }} />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Home / Services / <Box component="span" sx={{ color: "#212121", fontWeight: 500 }}>{service.category}</Box> / {service.name}
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper elevation={0} sx={{ display: "flex", flexWrap: { xs: "wrap", md: "nowrap" }, bgcolor: "#fff", borderRadius: 2, boxShadow: "0 1px 5px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          
          {/* Left - Image Section */}
          <Box sx={{ width: { xs: "100%", md: "45%" }, p: 3, borderRight: { md: "1px solid #f0f0f0" }, position: "relative" }}>
            {/* Main Image */}
            <Box sx={{ position: "relative", bgcolor: "#f8f8f8", borderRadius: 2, overflow: "hidden", textAlign: "center", p: 4, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box
                component="img"
                src={service.images?.[0] || service.image}
                alt={service.title || service.name}
                sx={{
                  width: "100%",
                  maxWidth: 450,
                  height: 350,
                  objectFit: "cover",
                  borderRadius: 2,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.02)" }
                }}
              />
              {service.discount > 0 && (
                <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                  <Chip 
                    icon={<FlashOnIcon sx={{ fontSize: 16 }} />}
                    label={`${service.discount}% OFF`} 
                    sx={{ 
                      bgcolor: "#ff6b35", 
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      height: 28,
                      boxShadow: "0 2px 8px rgba(255,107,53,0.4)",
                      "& .MuiChip-icon": { color: "#fff" }
                    }} 
                  />
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBookNow}
                startIcon={<Box component="span" sx={{ fontSize: 20 }}>📅</Box>}
                sx={{
                  flex: 1,
                  py: 1.5,
                  bgcolor: "#ff6b35",
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  borderRadius: 1,
                  boxShadow: "0 2px 8px rgba(255,107,53,0.3)",
                  "&:hover": { bgcolor: "#e55a2b", boxShadow: "0 4px 12px rgba(255,107,53,0.4)" }
                }}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                onClick={handleAddToCart}
                startIcon={<AddShoppingCartIcon />}
                sx={{
                  borderColor: "#4f46e5",
                  color: "#4f46e5",
                  fontWeight: 600,
                  textTransform: "none",
                  minWidth: 140,
                  "&:hover": { borderColor: "#4338ca", bgcolor: "#eef2ff" }
                }}
              >
                Add to Cart
              </Button>
              <IconButton onClick={toggleWishlist} sx={{ border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#fff", "&:hover": { bgcolor: "#f5f5f5" } }}>
                {isWishlisted ? <FavoriteIcon sx={{ color: "#e11d48" }} /> : <FavoriteBorderIcon sx={{ color: "#757575" }} />}
              </IconButton>
              <IconButton sx={{ border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#fff", "&:hover": { bgcolor: "#f5f5f5" } }}>
                <ShareIcon sx={{ color: "#757575" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Right - Details Section */}
          <Box sx={{ width: { xs: "100%", md: "55%" }, p: 3 }}>
            {/* Title */}
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3, color: "#212121", fontSize: { xs: 20, md: 24 } }}>
              {service.title || service.name}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f0fdf4", px: 1.5, py: 0.5, borderRadius: 1, gap: 0.5 }}>
                <Typography fontWeight={800} sx={{ color: "#166534", fontSize: 16 }}>{service.rating || 0}</Typography>
                <StarIcon sx={{ fontSize: 16, color: "#166534" }} />
              </Box>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                {service.totalRatings || service.reviews || 0} Ratings
              </Typography>
              <Box sx={{ height: 16, width: 1, bgcolor: "#e0e0e0" }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#4caf50" }} />
                <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: 600 }}>{service.bookingsCount || 0} Bookings</Typography>
              </Box>
            </Box>

            {/* Price */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                <Typography variant="h3" fontWeight={800} sx={{ color: "#212121", fontSize: { xs: 28, md: 36 } }}>
                  ₹{service.price}
                </Typography>
                {service.originalPrice > service.price && (
                  <>
                    <Typography variant="body1" sx={{ color: "#757575", textDecoration: "line-through" }}>
                      ₹{service.originalPrice}
                    </Typography>
                    {service.discount > 0 && (
                      <Chip label={`${service.discount}% OFF`} size="small" sx={{ bgcolor: "#ffeaea", color: "#c62828", fontWeight: 700, fontSize: 11, height: 24 }} />
                    )}
                  </>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: "#757575" }}>
                inclusive of all taxes
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Service Details Cards */}
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600} sx={{ mb: 1.5, color: "#212121", fontSize: 15 }}>Service Details</Typography>
              <Grid container spacing={0.5}>
                <Grid item xs={5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, px: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: "#9e9e9e" }} />
                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ py: 1, px: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "#212121" }}>{service.duration || "N/A"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, px: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, color: "#9e9e9e" }} />
                    <Typography variant="body2" color="text.secondary">Available</Typography>
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ py: 1, px: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "#212121" }}>{service.availability || "All Days"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, px: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                    <VerifiedIcon sx={{ fontSize: 18, color: "#9e9e9e" }} />
                    <Typography variant="body2" color="text.secondary">Verified</Typography>
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ py: 1, px: 1.5, bgcolor: "#fafafa", borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "#4caf50" }}>100% Verified</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Highlights */}
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600} sx={{ mb: 1.5, color: "#212121", fontSize: 15 }}>Highlights</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {(service.highlights?.length > 0 ? service.highlights : ["Trained Professionals", "Quality Guaranteed", "Post-Service Cleanup", "Instant Booking"]).map((tag, i) => (
                  <Chip 
                    key={i} 
                    label={tag} 
                    size="small" 
                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                    sx={{ 
                      bgcolor: "#f5f5f5", 
                      color: "#424242",
                      fontWeight: 500,
                      fontSize: 12,
                      border: "1px solid #e0e0e0",
                      "& .MuiChip-icon": { color: "#4caf50" }
                    }} 
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Schedule */}
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600} sx={{ mb: 1.5, color: "#212121", fontSize: 15 }}>Select Date & Time</Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ 
                  mb: 1.5, 
                  "& .MuiOutlinedInput-root": { 
                    borderRadius: 1,
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ff6b35" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ff6b35" }
                  }
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {timeSlots.slice(0, 6).map((time) => (
                  <Chip
                    key={time}
                    label={time}
                    clickable
                    onClick={() => setSelectedTime(time)}
                    variant={selectedTime === time ? "filled" : "outlined"}
                    sx={{ 
                      fontWeight: 500,
                      fontSize: 12,
                      borderColor: selectedTime === time ? "#ff6b35" : "#e0e0e0",
                      bgcolor: selectedTime === time ? "#ff6b35" : "#fff",
                      color: selectedTime === time ? "#fff" : "#424242",
                      "&:hover": { bgcolor: selectedTime === time ? "#e55a2b" : "#f5f5f5", borderColor: "#ff6b35" }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Trust Badges */}
            <Box sx={{ display: "flex", gap: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VerifiedIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                <Typography variant="caption" fontWeight={600} color="#424242">Quality Assured</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SupportAgentIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                <Typography variant="caption" fontWeight={600} color="#424242">24/7 Support</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LoopIcon sx={{ color: "#ff6b35", fontSize: 20 }} />
                <Typography variant="caption" fontWeight={600} color="#424242">Easy Reschedule</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        <Paper elevation={0} sx={{ mt: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: "0 1px 5px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)}
            sx={{ 
              borderBottom: "1px solid #f0f0f0",
              px: 2,
              "& .MuiTab-root": { 
                textTransform: "none", 
                fontWeight: 600,
                fontSize: 14,
                minHeight: 48,
                color: "#757575",
                "&.Mui-selected": { color: "#ff6b35" }
              },
              "& .MuiTabs-indicator": { bgcolor: "#ff6b35", height: 3 }
            }}
          >
            <Tab label="Description" />
            <Tab label="Reviews" />
            <Tab label="FAQs" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#212121" }}>About this service</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9, mb: 3 }}>
                  {service.description}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#212121" }}>What's Included</Typography>
                  <Grid container spacing={1}>
                    {["Professional and trained experts", "Quality assurance guaranteed", "100% satisfaction guarantee", "Post-service cleanup included", "Safety-first approach", "Customer support"].map((item, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 16 }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">{item}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}
            {activeTab === 1 && (
              <ServiceReviews 
                serviceId={service._id || id}
                providerId={service.provider?._id}
                canReview={canReview}
              />
            )}
            {activeTab === 2 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  FAQs coming soon...
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <Snackbar 
        open={cartSnackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setCartSnackbar({ ...cartSnackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ 
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "#fff",
          "& .MuiAlert-icon": { color: "#fff" }
        }}>
          {cartSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
