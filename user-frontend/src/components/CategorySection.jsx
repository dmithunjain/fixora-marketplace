import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Home Cleaning",
    icon: "🧹",
    bookings: "2M+ bookings",
    category: "cleaning"
  },
  {
    name: "AC Repair",
    icon: "❄️",
    bookings: "1.5M+ bookings",
    category: "ac"
  },
  {
    name: "Salon for Women",
    icon: "💅",
    bookings: "3M+ bookings",
    category: "salon"
  },
  {
    name: "Salon for Men",
    icon: "✂️",
    bookings: "800K+ bookings",
    category: "salon"
  },
  {
    name: "Electrician",
    icon: "⚡",
    bookings: "900K+ bookings",
    category: "electrical"
  },
  {
    name: "Plumbing",
    icon: "🔧",
    bookings: "600K+ bookings",
    category: "plumbing"
  },
  {
    name: "Appliance Repair",
    icon: "🔌",
    bookings: "400K+ bookings",
    category: "appliance"
  },
  {
    name: "Pest Control",
    icon: "🐛",
    bookings: "300K+ bookings",
    category: "pest-control"
  }
];

export default function CategorySection() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/services?category=${category}`);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontFamily: "Georgia"
            }}
          >
            What are you looking for?
          </Typography>
          <Typography sx={{ color: "gray", mt: 1 }}>
            Professional services for every need at home
          </Typography>
        </Box>

        <Typography
          onClick={() => navigate("/services")}
          sx={{
            color: "#f59e0b",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#d97706" }
          }}
        >
          See all →
        </Typography>
      </Box>

      {/* CATEGORY GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            sm: "repeat(4,1fr)",
            md: "repeat(8,1fr)"
          },
          gap: 3
        }}
      >
        {categories.map((cat, index) => (
          <Box
            key={index}
            onClick={() => handleCategoryClick(cat.category)}
            sx={{
              background: "#f6f6f6",
              borderRadius: "20px",
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              transition: "0.25s",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                background: "#f0f0ff"
              }
            }}
          >
            <Typography sx={{ fontSize: 34, mb: 1 }}>
              {cat.icon}
            </Typography>

            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {cat.name}
            </Typography>

            <Typography sx={{ fontSize: 12, color: "gray" }}>
              {cat.bookings}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
