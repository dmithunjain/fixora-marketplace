import { Box, Typography, IconButton, Divider, Container, Grid, Link } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Twitter, Phone, Email, LocationOn } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        color: "#fff",
        mt: 10,
      }}
    >
      {/* TOP SECTION */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* BRAND & ABOUT */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                F
              </Box>
              <Typography variant="h5" fontWeight={800}>
                Fixora
              </Typography>
            </Box>
            <Typography color="rgba(255,255,255,0.7)" fontSize={14} mb={2} lineHeight={1.8}>
              Your trusted partner for home services. From cleaning to repairs, 
              beauty to maintenance — we bring professionals to your doorstep.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: "#7c3aed" }} />
                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                  Mumbai, Maharashtra, India
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: "#7c3aed" }} />
                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 18, color: "#7c3aed" }} />
                <Typography variant="body2" color="rgba(255,255,255,0.6)">
                  support@fixora.in
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* QUICK LINKS */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={2} sx={{ color: "#4f46e5" }}>
              Quick Links
            </Typography>
            {["Home", "Services", "About Us", "Contact", "FAQ"].map((item) => (
              <Typography
                key={item}
                component="span"
                underline="hover"
                color="rgba(255,255,255,0.7)"
                fontSize={14}
                mb={1}
                display="block"
                sx={{ cursor: "pointer", "&:hover": { color: "#fff" } }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* SERVICES */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={2} sx={{ color: "#4f46e5" }}>
              Services
            </Typography>
            {["Electrician", "Plumber", "Cleaning", "Painting", "AC Repair", "Carpenter"].map((item) => (
              <Typography
                key={item}
                component="span"
                underline="hover"
                color="rgba(255,255,255,0.7)"
                fontSize={14}
                mb={1}
                display="block"
                sx={{ cursor: "pointer", "&:hover": { color: "#fff" } }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* LEGAL */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={2} sx={{ color: "#4f46e5" }}>
              Legal
            </Typography>
            {["Terms of Service", "Privacy Policy", "Refund Policy", "Cancellation Policy"].map((item) => (
              <Typography
                key={item}
                component="span"
                underline="hover"
                color="rgba(255,255,255,0.7)"
                fontSize={14}
                mb={1}
                display="block"
                sx={{ cursor: "pointer", "&:hover": { color: "#fff" } }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* CONNECT */}
          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={2} sx={{ color: "#4f46e5" }}>
              Connect With Us
            </Typography>
            <Typography color="rgba(255,255,255,0.6)" fontSize={14} mb={2}>
              Follow us on social media for updates and offers.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "#4f46e5" },
                }}
              >
                <Facebook sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "#E4405F" },
                }}
              >
                <Instagram sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "#0077b5" },
                }}
              >
                <LinkedIn sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "#1DA1F2" },
                }}
              >
                <Twitter sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* App Download */}
            <Typography fontWeight={700} mt={4} mb={1} sx={{ color: "#4f46e5" }}>
              Download App
            </Typography>
            <Typography color="rgba(255,255,255,0.6)" fontSize={13}>
              Get the Fixora app for easier booking
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* DIVIDER */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* BOTTOM BAR */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            py: 3,
            gap: 2,
          }}
        >
          <Typography fontSize={13} color="rgba(255,255,255,0.5)">
            © {new Date().getFullYear()} Fixora Technologies Pvt. Ltd. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Sitemap", "Cookies"].map((item) => (
              <Typography
                key={item}
                component="span"
                underline="hover"
                fontSize={13}
                color="rgba(255,255,255,0.5)"
                sx={{ cursor: "pointer", "&:hover": { color: "#fff" } }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
