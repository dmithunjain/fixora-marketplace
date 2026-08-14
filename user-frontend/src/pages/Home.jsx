import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import Hero from "../components/Hero";
import BannerCarousel from "../components/BannerCarousel";
import SpotlightSection from "../components/SpotlightSection";
import ServiceRow from "../components/ServiceRow";
import PromoBanner from "../components/PromoBanner";
import PromoBannerTwo from "../components/PromoBannerTwo";
import { Box } from "@mui/material";
import { PageSkeleton, HeroSkeleton } from "../components/SkeletonLoader";
import CategorySection from "../components/CategorySection";

import { services } from "../data/services";
import { publicServiceAPI } from "../services/api";
import { applyPlacementOverrides, extractPlacements } from "../utils/placementOverrides";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [homeServices, setHomeServices] = useState(services);

  const mostBookedServices = homeServices.slice(0, 5);
  const topLovedServices = [...homeServices].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const popularHomeServices = homeServices.filter((s) => String(s.category || "").includes("clean")).slice(0, 5);
  const womenSalonServices = homeServices.filter((s) => String(s.category || "").includes("salon")).slice(0, 5);
  const menSalonServices = homeServices.filter((s) => String(s.category || "").includes("salon")).slice(0, 5);
  
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    // Show skeleton immediately
    setLoading(true);

    const loadOverrides = async () => {
      try {
        const ids = services.map((s) => s.id).join(",");
        const response = await publicServiceAPI.getPlacementOverrides({ ids });
        const placements = extractPlacements(response);
        if (placements.length > 0) {
          setHomeServices(applyPlacementOverrides(services, placements, true));
        }
      } catch (err) {
        console.log("Home placement override fetch failed:", err.message);
      }
    };

    loadOverrides();
    
    // Simulate data fetching / image preloading
    const timer = setTimeout(() => {
      setLoading(false);
      setContentLoaded(true);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (contentLoaded) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [contentLoaded, handleScroll]);

  // Show skeleton while loading
  if (loading) {
    return (
      <Box sx={{ backgroundColor: "#f8f9ff", minHeight: "100vh" }}>
        <HeroSkeleton />
        <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
          <PageSkeleton />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9ff" }}>
      <Box
        sx={{
          background: "linear-gradient(180deg, #fff7f7 0%, #effcfa 60%, #ffffff 100%)"
        }}
      >
        <Hero scrollY={scrollY} />
        <BannerCarousel />
        <CategorySection />
      </Box>

      <SpotlightSection />

      <ServiceRow
        title="Most Booked Services"
        seeAllLink="/services"
        services={mostBookedServices}
        scrollY={scrollY}
      />

      <PromoBanner />

      <ServiceRow
        title="Top Services Customers Love"
        seeAllLink="/services"
        services={topLovedServices}
        scrollY={scrollY}
      />

      <PromoBannerTwo />

      <ServiceRow
        title="Popular Home Services"
        seeAllLink="/services"
        services={popularHomeServices}
        scrollY={scrollY}
      />

      <ServiceRow
        title="Salon & Beauty Services for Women"
        seeAllLink="/services"
        services={womenSalonServices}
        scrollY={scrollY}
      />

      <ServiceRow
        title="Men's Grooming & Haircut Services"
        seeAllLink="/services"
        services={menSalonServices}
        scrollY={scrollY}
      />
    </Box>
  );
}
