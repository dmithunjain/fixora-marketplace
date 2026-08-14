import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ServiceCard from "../components/ServiceCard";
import { services as staticServices } from "../data/services";
import { publicServiceAPI } from "../services/api";
import { applyPlacementOverrides, extractPlacements } from "../utils/placementOverrides";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem("fixoraWishlist") || "[]");
      
      try {
        const response = await publicServiceAPI.getServices({});
        const placements = extractPlacements(response);
        let services = [...staticServices];
        if (placements.length > 0) {
          services = applyPlacementOverrides(services, placements, true);
        }
        setAllServices(services);
      } catch (err) {
        setAllServices(staticServices);
      }

      setWishlistItems(stored);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (serviceId) => {
    const stored = JSON.parse(localStorage.getItem("fixoraWishlist") || "[]");
    const next = stored.filter(id => id !== serviceId);
    localStorage.setItem("fixoraWishlist", JSON.stringify(next));
    setWishlistItems(next);
  };

  const isInWishlist = (service) => {
    const idStr = String(service.id || '');
    const idNum = parseInt(service.id);
    return wishlistItems.includes(idStr) || 
           wishlistItems.includes(String(idNum)) ||
           (service._id && wishlistItems.includes(service._id));
  };

  const wishlistServices = allServices.filter(service => isInWishlist(service));

  const clearWishlist = () => {
    localStorage.setItem("fixoraWishlist", JSON.stringify([]));
    setWishlistItems([]);
  };

  return (
    <Box sx={{ 
      pt: { xs: 12, md: 14 }, 
      px: { xs: 2, md: 6 },
      pb: 8,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4,
        pb: 3,
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              bgcolor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                fontSize: { xs: '20px', md: '24px' }
              }}
            >
              My Wishlist
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '14px' }}>
              {wishlistServices.length} saved services
            </Typography>
          </Box>
        </Box>

        {wishlistServices.length > 0 && (
          <Button
            variant="outlined"
            onClick={clearWishlist}
            startIcon={<DeleteIcon />}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#ef4444',
                color: '#ef4444',
                bgcolor: '#fef2f2'
              }
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Wishlist Items */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#64748b' }}>Loading...</Typography>
        </Box>
      ) : wishlistServices.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 10,
          px: 2
        }}>
          <Box sx={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            bgcolor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <FavoriteIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
          </Box>
          <Typography sx={{ 
            fontSize: '20px', 
            fontWeight: 600,
            color: '#334155',
            mb: 1
          }}>
            Your wishlist is empty
          </Typography>
          <Typography sx={{ 
            fontSize: '14px', 
            color: '#64748b',
            mb: 4
          }}>
            Save services you like by clicking the heart icon
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/services"
            sx={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)'
              }
            }}
          >
            Browse Services
          </Button>
        </Box>
      ) : (
        <>
          {/* Quick Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 4,
            p: 2,
            bgcolor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <FavoriteIcon sx={{ color: '#e11d48' }} />
            <Typography sx={{ color: '#334155', fontSize: '14px' }}>
              Services you've saved for later
            </Typography>
          </Box>

          {/* Services Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3
          }}>
            {wishlistServices.map((service) => (
              <Box key={service.id} sx={{ position: 'relative' }}>
                <ServiceCard service={service} />
                <IconButton
                  onClick={() => removeFromWishlist(service.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    '&:hover': {
                      bgcolor: '#fef2f2'
                    }
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
