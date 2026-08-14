import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import bannerImg from "../assets/view-modern-air-fryer-with-food.jpg";

export default function PromoBannerTwo() {
  return (
    <Box sx={{ 
      px: { xs: 2, md: 8 }, 
      py: 4,
      background: "linear-gradient(180deg, #fff 0%, #eff6ff 100%)",
    }}>
      <Box
        sx={{
          height: { xs: 380, md: 520 },
          borderRadius: "25px",
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 65%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8fbff",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.5s ease",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          
          "&:hover": {
            transform: "translateY(-12px) scale(1.02)",
            boxShadow: "0 35px 80px rgba(0,0,0,0.35)",
          },

          "&:hover .overlay": {
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.3))",
          },
        }}
      >
        {/* Dark overlay */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.15))",
            transition: "all 0.4s ease",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            color: "#fff",
            px: { xs: 3, md: 6 },
            maxWidth: 520,
          }}
        >
          <Typography sx={{ letterSpacing: 2, opacity: 0.9 }} fontSize={14}>
            KITCHEN APPLIANCES
          </Typography>

          <Typography variant="h4" fontWeight={700} mt={1}>
            Smart Digital Air Fryer
          </Typography>

          <Typography fontSize={18} sx={{ opacity: 0.9 }} mt={1} mb={3}>
            Smart Digital Air Fryer
          </Typography>

          <Button
            component={Link}
            to="/services"
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "12px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#f2f2f2" },
            }}
          >
            Buy now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
