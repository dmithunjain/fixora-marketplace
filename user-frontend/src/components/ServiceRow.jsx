import { Box, Typography, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowForward, Star } from "@mui/icons-material";

const gradients = {
  "Most Booked Services": "linear-gradient(180deg, #fef3f2 0%, #fff 100%)",
  "Top Services Customers Love": "linear-gradient(180deg, #f0fdf4 0%, #fff 100%)",
  "Popular Home Services": "linear-gradient(180deg, #eff6ff 0%, #fff 100%)",
  "Salon & Beauty Services for Women": "linear-gradient(180deg, #fdf4ff 0%, #fff 100%)",
  "Men's Grooming & Haircut Services": "linear-gradient(180deg, #fff7ed 0%, #fff 100%)",
};

const categoryMap = {
  "Most Booked Services": "",
  "Top Services Customers Love": "",
  "Popular Home Services": "cleaning",
  "Salon & Beauty Services for Women": "salon-women",
  "Men's Grooming & Haircut Services": "salon",
};

export default function ServiceRow({ title, seeAllLink, services, scrollY = 0 }) {
  const [visible, setVisible] = useState(false);
  const [cardOffsets, setCardOffsets] = useState([]);
  const sectionRef = useRef(null);
  const gradient = gradients[title] || "linear-gradient(180deg, #f8fbff 0%, #fff 100%)";
  const categoryParam = categoryMap[title] || "all";
  const servicesLink = `/services${categoryParam !== "all" ? `?category=${categoryParam}` : ""}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && services.length > 0) {
      const offsets = services.map((_, index) => {
        const baseOffset = index * 3;
        const floatOffset = Math.sin((scrollY + index * 100) * 0.01) * 4;
        return baseOffset + floatOffset;
      });
      setCardOffsets(offsets);
    }
  }, [scrollY, visible, services]);

  const SectionSkeleton = () => (
    <Box sx={{ px: { xs: 2, md: 8 }, py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Skeleton variant="text" width={280} height={40} />
        <Skeleton variant="text" width={80} height={24} sx={{ mt: 1 }} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(5, 1fr)" },
          gap: 3,
        }}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <Box key={item}>
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: "16px", mb: 1.5 }}
              animation="wave"
            />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="40%" height={18} />
            <Skeleton variant="text" width="50%" height={28} />
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: visible ? "auto" : 400,
        background: gradient,
      }}
    >
      {!visible ? (
        <SectionSkeleton />
      ) : (
        <Box
          sx={{
            px: { xs: 2, md: 8 },
            py: 4,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={5}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                  borderRadius: 2,
                }}
              />
            </Box>

            <Link to={servicesLink} style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#4f46e5",
                  fontWeight: 600,
                  fontSize: 14,
                  "&:hover": { color: "#7c3aed" },
                  transition: "all 0.3s",
                }}
              >
                View All <ArrowForward sx={{ fontSize: 18 }} />
              </Box>
            </Link>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 3,
            }}
          >
            {services.map((service, index) => (
              <Link
                key={index}
                to={`/service/${service.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    borderRadius: "20px",
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: `translateY(${cardOffsets[index] || 0}px)`,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(79, 70, 229, 0.15)",
                    },
                    "&:hover .service-image": {
                      transform: "scale(1.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "20px 20px 0 0",
                    }}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.name}
                      loading="lazy"
                      className="service-image"
                      sx={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "rgba(255,255,255,0.95)",
                        borderRadius: "20px",
                        px: 1.5,
                        py: 0.3,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Star sx={{ fontSize: 14, color: "#f59e0b" }} />
                      <Typography fontSize={12} fontWeight={700}>
                        {service.rating}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography
                      fontWeight={700}
                      sx={{
                        fontSize: 15,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#1a1a2e",
                      }}
                    >
                      {service.name}
                    </Typography>

                    <Typography
                      fontSize={13}
                      color="text.secondary"
                      sx={{ mb: 1.5, minHeight: 20 }}
                    >
                      Starting from
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                      <Typography
                        fontWeight={800}
                        sx={{
                          fontSize: 18,
                          color: "#4f46e5",
                        }}
                      >
                        ₹{service.price}
                      </Typography>
                      <Typography
                        component="span"
                        fontSize={12}
                        color="text.secondary"
                      >
                        onwards
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
