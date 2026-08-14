import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const goToService = () => {
    const serviceId = service._id || service.id;
    if (!serviceId) return;
    navigate(`/service/${serviceId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const serviceId = service._id || service.id;
    addToCart({
      ...service,
      id: serviceId,
      _id: serviceId,
      cartId: serviceId,
      name: service.title || service.name,
      title: service.title || service.name,
      image: service.images?.[0] || service.image,
      price: Number(service.price || 0),
      category: service.category
    });
    setSnackbarOpen(true);
  };

  const serviceImage = service.images?.[0] || service.image;
  const serviceTitle = service.title || service.name;
  const servicePrice = service.price;
  const serviceDiscount = service.discount;

  return (
    <>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ 
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "#fff",
          "& .MuiAlert-icon": { color: "#fff" }
        }}>
          Added to cart!
        </Alert>
      </Snackbar>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 16px 48px rgba(79, 70, 229, 0.15)",
          },
          "&:hover .service-img": {
            transform: "scale(1.08)",
          },
        }}
        onClick={goToService}
      >
        <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
          {service.discount && (
            <Box sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "#22c55e",
              color: "#fff",
              fontSize: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              fontWeight: 600,
              zIndex: 2,
              boxShadow: "0 2px 8px rgba(34, 197, 94, 0.4)",
            }}>
              {service.discount}
            </Box>
          )}
          {service.tag && (
            <Box sx={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(255,255,255,0.95)",
              color: "#92400e",
              fontSize: 11,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              fontWeight: 600,
              zIndex: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
              {service.tag}
            </Box>
          )}
          <Box
            component="img"
            src={serviceImage}
            alt={serviceTitle}
            className="service-img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />
          <Box sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            px: 1.5,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 0.3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            <StarIcon sx={{ color: "#f59e0b", fontSize: 14 }} />
            <Typography fontSize={12} fontWeight={700}>
              {service.rating}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Typography sx={{ 
            fontWeight: 700, 
            fontSize: 16, 
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#1a1a2e",
          }}>
            {serviceTitle}
          </Typography>

          <Typography sx={{ 
            fontSize: 13, 
            color: "#666", 
            mb: 1.5, 
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 39,
          }}>
            {service.description}
          </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: "#999", mr: 0.5 }} />
            <Typography sx={{ fontSize: 12, color: "#666" }}>
              {service.duration || service.duration}
            </Typography>
            <Typography sx={{ 
              fontSize: 12, 
              color: "#999", 
              ml: "auto",
              background: "#f5f5f5",
              px: 1,
              py: 0.2,
              borderRadius: "10px",
            }}>
              {service.totalRatings || service.reviews || 0} reviews
            </Typography>
          </Box>

          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mt: "auto",
            pt: 1.5,
            borderTop: "1px solid #f0f0f0",
          }}>
            <Box>
              <Typography sx={{ 
                fontWeight: 800, 
                fontSize: 20,
                color: "#4f46e5",
              }}>
                ₹{servicePrice}
              </Typography>
              {(service.originalPrice || service.oldPrice) && serviceDiscount > 0 && (
                <Typography sx={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>
                  ₹{service.originalPrice || service.oldPrice}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                borderRadius: "20px",
                px: 2.5,
                py: 0.8,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                  boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
                },
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
