import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState, useEffect } from "react";

const categories = [
  { name: "Women's Salon", icon: "💅", slug: "salon-women" },
  { name: "Massage for Men", icon: "💆", slug: "massage-men" },
  { name: "Cleaning & Pest", icon: "🧹", slug: "cleaning" },
  { name: "AC Repair", icon: "❄️", slug: "ac" },
  { name: "Water Purifier", icon: "💧", slug: "water" },
  { name: "Tile Grouting", icon: "🧱", slug: "tile" },
  { name: "Painting", icon: "🎨", slug: "painting" },
  { name: "Wall Makeover", icon: "🪵", slug: "wall" },
];

export default function Hero({ scrollY = 0 }) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const parallax1 = scrollY * 0.08;
  const parallax2 = scrollY * 0.12;
  const parallax3 = scrollY * 0.06;
  const parallax4 = scrollY * 0.1;

  return (
    <Box
      sx={{
        pt: 14,
        pb: 10,
        px: { xs: 2, md: 8 },
        display: "flex",
        gap: 6,
        flexDirection: { xs: "column", md: "row" },

        // ── UPDATED: background + glow pools ──
        background: "linear-gradient(160deg, #fff0fe 0%, #ffe8f3 18%, #f2e8ff 38%, #f0f5ff 58%, #f7f0ff 80%, #f5e8ff 100%)",
        overflow: "hidden",
        position: "relative",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 55% 35% at 25% 0%, rgba(167,139,250,0.28) 0%, transparent 70%),
            radial-gradient(ellipse 45% 30% at 75% 0%, rgba(96,165,250,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 60% 35% at 50% 100%, rgba(244,114,182,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 40% 28% at 15% 100%, rgba(139,92,246,0.2) 0%, transparent 60%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        },

        // Big purple circle — top left (via ::after)
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-70px",
          left: "-50px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.32) 0%, rgba(139,92,246,0.08) 65%, transparent 100%)",
          border: "1.5px solid rgba(139,92,246,0.35)",
          animation: "shapeFloat1 7s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        },

        "@keyframes shapeFloat1":  { "0%,100%": { transform: "translateY(0px) scale(1)" },   "50%": { transform: "translateY(22px) scale(1.05)" } },
        "@keyframes shapeFloat2":  { "0%,100%": { transform: "translateY(0px) rotate(0deg)" },"50%": { transform: "translateY(26px) rotate(10deg)" } },
        "@keyframes shapeFloat3":  { "0%,100%": { transform: "translateY(0px) scale(1)" },   "50%": { transform: "translateY(30px) scale(0.93)" } },
        "@keyframes shapeFloat4":  { "0%,100%": { transform: "translateY(0px) rotate(0deg)" },"50%": { transform: "translateY(20px) rotate(-12deg)" } },
        "@keyframes shapeFloat5":  { "0%,100%": { transform: "translateY(0px) scale(1)" },   "50%": { transform: "translateY(28px) scale(1.06)" } },
        "@keyframes shapeFloat6":  { "0%,100%": { transform: "translateY(0px) rotate(0deg)" },"50%": { transform: "translateY(16px) rotate(15deg)" } },
        "@keyframes shapeFloat7":  { "0%,100%": { transform: "translateY(0px) scale(1)" },   "50%": { transform: "translateY(-26px) scale(1.05)" } },
        "@keyframes shapeFloat8":  { "0%,100%": { transform: "translateY(0px) rotate(0deg)" },"50%": { transform: "translateY(-22px) rotate(-8deg)" } },
        "@keyframes shapeFloat9":  { "0%,100%": { transform: "translateY(0px) scale(1)" },   "50%": { transform: "translateY(-28px) scale(0.94)" } },
        "@keyframes shapeFloat10": { "0%,100%": { transform: "translateY(0px) rotate(0deg)" },"50%": { transform: "translateY(-18px) rotate(12deg)" } },
        "@keyframes shapeFloat11": { "0%,100%": { transform: "translateY(0px) scale(1)" },   "50%": { transform: "translateY(-24px) scale(1.06)" } },
        "@keyframes shapeFloat12": { "0%,100%": { transform: "translateY(0px) rotate(0deg)" },"50%": { transform: "translateY(-14px) rotate(-14deg)" } },
      }}
    >

      {/* ── TOP SHAPES ─────────────────────────────── */}

      {/* Blue rounded square — top center-left */}
      <Box sx={{ position: "absolute", top: "-28px", left: "28%", width: "80px", height: "80px", borderRadius: "20px", background: "rgba(96,165,250,0.22)", border: "1.5px solid rgba(96,165,250,0.45)", animation: "shapeFloat2 6s ease-in-out infinite 0.4s", pointerEvents: "none", zIndex: 0 }} />

      {/* Pink circle — top center */}
      <Box sx={{ position: "absolute", top: "-45px", left: "48%", width: "130px", height: "130px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244,114,182,0.26) 0%, rgba(244,114,182,0.06) 70%, transparent 100%)", border: "1.5px solid rgba(244,114,182,0.38)", animation: "shapeFloat3 9s ease-in-out infinite 0.8s", pointerEvents: "none", zIndex: 0 }} />

      {/* Purple small square — top center-right */}
      <Box sx={{ position: "absolute", top: "-18px", left: "64%", width: "56px", height: "56px", borderRadius: "14px", background: "rgba(167,139,250,0.25)", border: "1.5px solid rgba(167,139,250,0.5)", animation: "shapeFloat4 5.5s ease-in-out infinite 1.2s", pointerEvents: "none", zIndex: 0 }} />

      {/* Blue circle — top right */}
      <Box sx={{ position: "absolute", top: "-55px", right: "60px", width: "170px", height: "170px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.06) 65%, transparent 100%)", border: "1.5px solid rgba(59,130,246,0.32)", animation: "shapeFloat5 8s ease-in-out infinite 0.3s", pointerEvents: "none", zIndex: 0 }} />

      {/* Pink tiny square — top far right */}
      <Box sx={{ position: "absolute", top: "20px", right: "20px", width: "42px", height: "42px", borderRadius: "10px", background: "rgba(251,182,206,0.35)", border: "1.5px solid rgba(244,114,182,0.45)", animation: "shapeFloat6 6.5s ease-in-out infinite 2s", pointerEvents: "none", zIndex: 0 }} />

      {/* ── BOTTOM SHAPES ──────────────────────────── */}

      {/* Purple big circle — bottom left */}
      <Box sx={{ position: "absolute", bottom: "-65px", left: "30px", width: "190px", height: "190px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.24) 0%, rgba(124,58,237,0.06) 65%, transparent 100%)", border: "1.5px solid rgba(124,58,237,0.35)", animation: "shapeFloat7 8.5s ease-in-out infinite 0.6s", pointerEvents: "none", zIndex: 0 }} />

      {/* Blue rounded square — bottom left-center */}
      <Box sx={{ position: "absolute", bottom: "-20px", left: "22%", width: "72px", height: "72px", borderRadius: "18px", background: "rgba(96,165,250,0.2)", border: "1.5px solid rgba(96,165,250,0.42)", animation: "shapeFloat8 6s ease-in-out infinite 1.5s", pointerEvents: "none", zIndex: 0 }} />

      {/* Pink circle — bottom center */}
      <Box sx={{ position: "absolute", bottom: "-50px", left: "44%", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244,114,182,0.28) 0%, rgba(244,114,182,0.07) 65%, transparent 100%)", border: "1.5px solid rgba(244,114,182,0.4)", animation: "shapeFloat9 10s ease-in-out infinite 0.2s", pointerEvents: "none", zIndex: 0 }} />

      {/* Purple small square — bottom right-center */}
      <Box sx={{ position: "absolute", bottom: "-10px", right: "28%", width: "52px", height: "52px", borderRadius: "12px", background: "rgba(167,139,250,0.28)", border: "1.5px solid rgba(167,139,250,0.52)", animation: "shapeFloat10 5s ease-in-out infinite 1s", pointerEvents: "none", zIndex: 0 }} />

      {/* Blue circle — bottom right */}
      <Box sx={{ position: "absolute", bottom: "-60px", right: "40px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 65%, transparent 100%)", border: "1.5px solid rgba(59,130,246,0.34)", animation: "shapeFloat11 9s ease-in-out infinite 1.8s", pointerEvents: "none", zIndex: 0 }} />

      {/* Pink tiny square — bottom far right */}
      <Box sx={{ position: "absolute", bottom: "28px", right: "18px", width: "38px", height: "38px", borderRadius: "9px", background: "rgba(251,182,206,0.38)", border: "1.5px solid rgba(244,114,182,0.48)", animation: "shapeFloat12 7s ease-in-out infinite 2.5s", pointerEvents: "none", zIndex: 0 }} />

      {/* ── YOUR ORIGINAL CONTENT — untouched ─────── */}

      {/* LEFT SIDE */}
      <Box sx={{ flex: 1, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          <TypeAnimation
            sequence={[
              'Home services at your doorstep', 5000,
              'Home services at anytime and anywhere', 5000,
              'Home services nearby you', 5000,
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              fontFamily: 'Georgia',
              display: 'block',
              marginBottom: '2rem',
              color: '#1a1a2e',
            }}
          />
        </Box>

        {/* SERVICE BOX */}
        <Box
          sx={{
            background: "#f5f5f5",
            borderRadius: "18px",
            p: 4,
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.2s',
          }}
        >
          <Typography sx={{ fontSize: "18px", mb: 3, fontWeight: 500 }}>
            What are you looking for?
          </Typography>

          {/* CATEGORY GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)" },
              gap: 2,
            }}
          >
            {categories.map((cat, idx) => (
              <Box
                key={cat.slug}
                onClick={() => navigate(`/category/${cat.slug}`)}
                sx={{
                  background: "#fff",
                  borderRadius: "12px",
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease-out ${0.3 + idx * 0.05}s`,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "30px", mb: 1 }}>{cat.icon}</Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>{cat.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* RIGHT SIDE IMAGES with parallax */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          perspective: "1000px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? `translateY(${parallax1}px)` : 'translateY(30px)', transition: 'all 0.1s linear' }}>
          <img src="Facial-Clean-up.jpg" alt="Facial Clean-up" style={{ width: "100%", borderRadius: "14px" }} />
        </Box>
        <Box sx={{ marginTop: "30px", opacity: isLoaded ? 1 : 0, transform: isLoaded ? `translateY(${-parallax2}px)` : 'translateY(30px)', transition: 'all 0.1s linear' }}>
          <img src="Furniture-Banner2.jpg" alt="Furniture" style={{ width: "100%", borderRadius: "14px" }} />
        </Box>
        <Box sx={{ marginTop: "-30px", opacity: isLoaded ? 1 : 0, transform: isLoaded ? `translateY(${-parallax3}px)` : 'translateY(30px)', transition: 'all 0.1s linear' }}>
          <img src="Furniture-Banner4.jpg" alt="Furniture Banner" style={{ width: "100%", borderRadius: "14px" }} />
        </Box>
        <Box sx={{ opacity: isLoaded ? 1 : 0, transform: isLoaded ? `translateY(${parallax4}px)` : 'translateY(30px)', transition: 'all 0.1s linear' }}>
          <img src="Hair-Scalp-Treatment.jpg" alt="Hair Scalp Treatment" style={{ width: "100%", borderRadius: "14px" }} />
        </Box>
      </Box>

    </Box>
  );
}