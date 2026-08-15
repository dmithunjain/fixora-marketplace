import { Box, Typography, Button, Container, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ProviderHome() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f7ff 0%, #f0eeff 50%, #e8e4ff 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative Background Elements */}
      <Box sx={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
        top: -200,
        right: -200
      }} />
      <Box sx={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)",
        bottom: -100,
        left: -100
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 1, bgcolor: "#fff", borderRadius: "50px", mb: 3, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
                <VerifiedUserIcon sx={{ fontSize: 16, color: "#4f46e5" }} />
                <Typography variant="caption" fontWeight={600} color="#4f46e5">
                  JOIN 10,000+ VERIFIED PARTNERS
                </Typography>
              </Box>

              <Typography variant="h2" fontWeight={800} sx={{ 
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.1,
                mb: 2,
                background: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Grow Your Service Business with Fixora
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400 }}>
                Join India's fastest-growing service marketplace. Get access to thousands of customers, manage your bookings, and grow your earnings - all from one platform.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to="/provider/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: "16px",
                    fontSize: "1rem",
                    boxShadow: "0 8px 32px rgba(79, 70, 229, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(79, 70, 229, 0.5)"
                    }
                  }}
                >
                  Register as Provider
                </Button>

                <Button
                  component={Link}
                  to="/provider/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#4f46e5",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: "16px",
                    fontSize: "1rem",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      bgcolor: "#f5f5ff"
                    }
                  }}
                >
                  Provider Login
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{
              position: "relative",
              bgcolor: "#fff",
              borderRadius: "32px",
              p: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
            }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                {[
                  { icon: <TrendingUpIcon />, value: "200%", label: "Avg. Income Growth", color: "#4f46e5", bg: "#eef2ff" },
                  { icon: <GroupsIcon />, value: "10K+", label: "Active Partners", color: "#16a34a", bg: "#dcfce7" },
                  { icon: <StarIcon />, value: "4.8", label: "Partner Rating", color: "#ea580c", bg: "#fef3c7" },
                  { icon: <AccessTimeIcon />, value: "24/7", label: "Support Available", color: "#7c3aed", bg: "#f3e8ff" }
                ].map((stat, i) => (
                  <Box key={i} sx={{
                    p: 3,
                    bgcolor: stat.bg,
                    borderRadius: "20px",
                    textAlign: "center"
                  }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: "14px",
                      bgcolor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" fontWeight={800} color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{
                mt: 3,
                p: 3,
                bgcolor: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "20px",
                color: "#fff"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AttachMoneyIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={800}>
                      ₹50K+
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Average monthly earnings
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Benefits Section */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 2 }}>
            Why Partner with Fixora?
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 600, mx: "auto" }}>
            Everything you need to grow your service business in one powerful platform
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: "📱",
                title: "Easy Booking Management",
                desc: "Manage all your bookings from a single dashboard. Accept, reschedule, or cancel with just a tap.",
                color: "#4f46e5",
                bg: "#eef2ff"
              },
              {
                icon: "💰",
                title: "Secure Payments",
                desc: "Get paid directly to your bank account. Track all transactions and earnings in real-time.",
                color: "#16a34a",
                bg: "#dcfce7"
              },
              {
                icon: "⭐",
                title: "Build Your Reputation",
                desc: "Collect reviews and ratings to build trust. Higher ratings mean more customers.",
                color: "#ea580c",
                bg: "#fef3c7"
              },
              {
                icon: "📊",
                title: "Detailed Analytics",
                desc: "Track your performance with insights on bookings, earnings, and customer preferences.",
                color: "#7c3aed",
                bg: "#f3e8ff"
              },
              {
                icon: "🛡️",
                title: "Verified Customers",
                desc: "All customers are verified. Work with peace of mind knowing you're protected.",
                color: "#0891b2",
                bg: "#ecfeff"
              },
              {
                icon: "🎯",
                title: "Smart Matching",
                desc: "Our algorithm matches you with customers in your area and service category.",
                color: "#dc2626",
                bg: "#fee2e2"
              }
            ].map((benefit, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ 
                  height: "100%", 
                  borderRadius: "24px",
                  transition: "all 0.3s ease",
                  border: "1px solid transparent",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    border: `1px solid ${benefit.bg}`
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "18px",
                      bgcolor: benefit.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      fontSize: "32px"
                    }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {benefit.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{
          mt: 10,
          p: 6,
          bgcolor: "#fff",
          borderRadius: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <Box sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "#f0f0ff",
            top: -100,
            right: -50
          }} />
          
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <SecurityIcon sx={{ fontSize: 60, color: "#4f46e5", mb: 2 }} />
            <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
              Ready to Start Earning?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
              Join thousands of service professionals who are already growing their business with Fixora. Registration is free!
            </Typography>
            <Button
              component={Link}
              to="/provider/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#fff",
                fontWeight: 700,
                px: 5,
                py: 1.5,
                borderRadius: "16px",
                fontSize: "1.1rem",
                boxShadow: "0 8px 32px rgba(79, 70, 229, 0.4)"
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
