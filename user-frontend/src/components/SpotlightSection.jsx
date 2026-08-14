import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

import revampImg from "../assets/spotlight-revamp.jpg";
import instaHelpImg from "../assets/spotlight-insta-help.jpg";
import luxeImg from "../assets/spotlight-luxe.jpg";

export default function SpotlightSection() {
  return (
    <Box sx={{ 
      px: { xs: 2, md: 8 }, 
      py: 4,
      background: "linear-gradient(180deg, #fff 0%, #f0fdf4 50%, #eff6ff 100%)",
    }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        In the spotlight
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {/* CARD 1 */}
        <Box sx={spotlightCard(revampImg)}>
          <Typography variant="h6" fontWeight={700}>
            Big transformations,
            <br /> zero stress.
          </Typography>
          <Button variant="contained" sx={whiteButton}>
            Book now
          </Button>
        </Box>

        {/* CARD 2 */}
        <Box sx={spotlightCard(instaHelpImg)}>
          <Typography variant="h6" fontWeight={700}>
            Insta Help
          </Typography>
          <Typography variant="body2">
            Trained house help when you need it
          </Typography>
          <Button 
            variant="contained" 
            sx={whiteButton}
            component={Link}
            to="/support"
          >
            Customer service 
          </Button>
        </Box>

        {/* CARD 3 */}
        <Box sx={spotlightCard(luxeImg)}>
          <Typography variant="h6" fontWeight={700}>
            Beauty Special Packages
          </Typography>
          <Typography variant="body2">
            Curated for special occasions
          </Typography>
          <Button variant="contained" sx={whiteButton}>
            Book now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- STYLES ---------- */

const spotlightCard = (image) => ({
  position: "relative",
  height: 260,
  borderRadius: "24px",
  overflow: "hidden",
  padding: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 1,
  color: "#fff",
  cursor: "pointer",

  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",

  transition: "all 0.4s ease",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2))",
    transition: "all 0.4s ease",
    zIndex: 0,
  },

  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
  },

  "&:hover::before": {
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.3))",
  },

  "& > *": {
    position: "relative",
    zIndex: 1,
    maxWidth: "75%",
  },
});

const whiteButton = {
  mt: 2,
  backgroundColor: "#fff",
  color: "#111",
  fontWeight: 600,
  borderRadius: "20px",
  textTransform: "none",
  px: 3,
  py: 1,
  alignSelf: "flex-start",
  transition: "all 0.3s ease",

  "&:hover": {
    backgroundColor: "#f3f4f6",
    transform: "translateY(-3px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
  },
};
