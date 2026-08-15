import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import { ServicesSkeleton } from "../components/SkeletonLoader";
import { publicServiceAPI } from "../services/api";
import { mapService } from "../utils/serviceMapper";

const categories = [
  { id: "all", label: "All Services" },
  { id: "home-cleaning", label: "Cleaning" },
  { id: "ac-repair", label: "AC Service" },
  { id: "appliance-repair", label: "Appliances" },
  { id: "electrical", label: "Electrical" },
  { id: "salon-spa", label: "Salon & Beauty" },
  { id: "painting", label: "Painting" },
  { id: "plumbing", label: "Plumbing" },
  { id: "pest-control", label: "Pest Control" },
  { id: "carpenter", label: "Carpenter" },
  { id: "gardening", label: "Gardening" },
];

const categoryAliases = {
  "home-cleaning": ["home-cleaning", "cleaning", "clean"],
  "ac-repair": ["ac-repair", "ac", "ac-service"],
  "appliance-repair": ["appliance-repair", "appliance", "appliances"],
  electrical: ["electrical", "electrician"],
  "salon-spa": ["salon-spa", "salon", "salon-women", "massage-men", "beauty"],
  painting: ["painting"],
  plumbing: ["plumbing", "water", "tile", "wall"],
  "pest-control": ["pest-control", "pest"],
  carpenter: ["carpenter", "carpentry", "furniture"],
  gardening: ["gardening", "garden"],
};

const normalizeValue = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-");

const matchesCategory = (service, selectedCategory) => {
  if (!service || selectedCategory === "all") return true;

  const normalizedSelected = normalizeValue(selectedCategory);
  const allowed = categoryAliases[normalizedSelected] || [normalizedSelected];

  const candidates = [
    normalizeValue(service.category),
    normalizeValue(service.categoryId),
    normalizeValue(service.subCategory),
    normalizeValue(service.subCategoryId),
  ].filter(Boolean);

  return candidates.some((candidate) => allowed.includes(candidate));
};

const unwrapResponse = (response) => response?.data || response;

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pageId: pageIdParam } = useParams();
  const [filter, setFilter] = useState("popular");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [pageTitle, setPageTitle] = useState("Services");

  useEffect(() => {
    const cat = searchParams.get("category");
    const searchQuery = searchParams.get("q");
    const pageId = pageIdParam;
    
    // Only set category from params if there's no search query
    if (cat && categories.find((c) => c.id === cat) && !searchQuery) {
      setCategory(cat);
    } else {
      setCategory("all");
    }
    
    if (searchQuery) {
      setPageTitle(`Search Results`);
    } else if (pageId) {
      setPageTitle(`Services - Page ${pageId}`);
    } else {
      setPageTitle("Services");
    }
    
    fetchServices();
  // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [searchParams, pageIdParam]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const pageId = pageIdParam;
      const searchQuery = searchParams.get("q");
      const catParam = searchParams.get("category");
      
      let combinedServices = [];
      
      // If pageId exists, fetch services for that specific page
      if (pageId) {
        try {
          const params = {};
          const response = await publicServiceAPI.getServicesByPage(pageId, params);
          const payload = unwrapResponse(response);

          if (payload?.services && payload.services.length > 0) {
            const dynamicServices = payload.services
              .map((s) => mapService(s))
              .filter(Boolean);
            combinedServices = dynamicServices;
          }
        } catch (err) {
          console.log("Dynamic services fetch failed:", err.message);
        }
      } else {
        // For all services page, fetch all published from backend (provider-added services only)
        // Skip first 16 services only on main "all services" page (not on category filtered pages)
        try {
          const params = {};
          const isMainServicesPage = !catParam || catParam === 'all';
          
          if (isMainServicesPage) {
            params.page = 2;  // Skip first 16
            params.limit = 16;
          } else {
            params.limit = 100;
          }
          
          if (catParam && catParam !== 'all') params.category = catParam;
          if (searchQuery) params.search = searchQuery;
          
          const response = await publicServiceAPI.getServices(params);
          const payload = unwrapResponse(response);

          if (payload?.services && payload.services.length > 0) {
            const dynamicServices = payload.services
              .map((s) => mapService(s))
              .filter(Boolean);
            combinedServices = dynamicServices;
          }
        } catch (err) {
          console.log("Dynamic services fetch failed:", err.message);
          combinedServices = [];
        }
      }
      
      setServices(combinedServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  let filtered = services.filter((service) => matchesCategory(service, category));

  if (filter === "top") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filter === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (filter === "popular") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const handleCategoryChange = (val) => {
    setCategory(val);

    const nextParams = new URLSearchParams();
    if (val !== "all") {
      nextParams.set("category", val);
    }
    setSearchParams(nextParams);
  };

  if (loading) {
    return (
      <Box sx={{ background: "linear-gradient(180deg, #f8fbff 0%, #fff 100%)", minHeight: "100vh", py: 4, px: { xs: 2, md: 8 } }}>
        <ServicesSkeleton count={12} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "linear-gradient(180deg, #f8fbff 0%, #fff 100%)", minHeight: "100vh" }}>
      <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            {pageTitle}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {filtered.length} services available
          </Typography>
          {searchParams.get("q") && (
            <Typography sx={{ mt: 1, fontSize: 14, color: "#666" }}>
              Showing results for "{searchParams.get("q")}". 
              Try different keywords or browse categories below.
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            background: "#fff",
            borderRadius: "16px",
            p: 1,
            mb: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Tabs
            value={category}
            onChange={(e, val) => handleCategoryChange(val)}
            sx={{
              minHeight: "auto",
              "& .MuiTabs-indicator": {
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                minHeight: 44,
                fontWeight: 600,
                fontSize: 14,
                textTransform: "none",
                color: "#666",
                px: 3,
                "&.Mui-selected": {
                  color: "#4f46e5",
                },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat.id} label={cat.label} value={cat.id} />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {categories.find((c) => c.id === category)?.label || "All Services"}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip
              label="Most Booked"
              onClick={() => setFilter("popular")}
              variant={filter === "popular" ? "filled" : "outlined"}
              sx={{
                backgroundColor: filter === "popular" ? "#4f46e5" : "transparent",
                color: filter === "popular" ? "#fff" : "#666",
                borderColor: "#4f46e5",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: filter === "popular" ? "#4338ca" : "#f0f0ff",
                },
              }}
            />

            <Chip
              label="Top Rated"
              onClick={() => setFilter("top")}
              variant={filter === "top" ? "filled" : "outlined"}
              sx={{
                backgroundColor: filter === "top" ? "#4f46e5" : "transparent",
                color: filter === "top" ? "#fff" : "#666",
                borderColor: "#4f46e5",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: filter === "top" ? "#4338ca" : "#f0f0ff",
                },
              }}
            />

            <Chip
              label="Price: Low"
              onClick={() => setFilter("low")}
              variant={filter === "low" ? "filled" : "outlined"}
              sx={{
                backgroundColor: filter === "low" ? "#4f46e5" : "transparent",
                color: filter === "low" ? "#fff" : "#666",
                borderColor: "#4f46e5",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: filter === "low" ? "#4338ca" : "#f0f0ff",
                },
              }}
            />
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {filtered.map((service) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
              <ServiceCard service={service} />
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No services found in this category
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
