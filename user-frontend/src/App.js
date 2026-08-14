// src/App.js
import React from "react";
import { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { Box } from "@mui/material";

/* Components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { PageSkeleton, ErrorState } from "./components/SkeletonLoader";

/* Context */
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { NotificationProvider } from "./context/NotificationContext";

/* Lazy loaded pages for better performance */
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Support = lazy(() => import("./pages/Support"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ChangeEmail = lazy(() => import("./pages/ChangeEmail"));
const ChangePhone = lazy(() => import("./pages/ChangePhone"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const MyReviews = lazy(() => import("./pages/MyReviews"));

/* Provider Pages */
const ProviderLogin = lazy(() => import("./pages/provider/ProviderLogin"));
const ProviderRegister = lazy(() => import("./pages/provider/ProviderRegister"));
const ProviderDashboard = lazy(() => import("./pages/provider/ProviderDashboard"));
const Notifications = lazy(() => import("./pages/provider/Notifications"));
const AddService = lazy(() => import("./pages/provider/AddService"));
const MyServices = lazy(() => import("./pages/provider/MyServices"));
const EditService = lazy(() => import("./pages/provider/EditService"));
const Wallet = lazy(() => import("./pages/provider/Wallet"));
const ProviderBookings = lazy(() => import("./pages/provider/ProviderBookings"));
const ProviderVerification = lazy(() => import("./pages/provider/ProviderVerification"));
const ProviderTickets = lazy(() => import("./pages/provider/ProviderTickets"));
const ProviderHome = lazy(() => import("./pages/provider/ProviderHome"));
const ProviderProfile = lazy(() => import("./pages/provider/ProviderProfile"));
const ForgotPassword = lazy(() => import("./pages/provider/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/provider/ResetPassword"));

/* ============================================
   ERROR BOUNDARY
   Catches errors and shows fallback UI
   ============================================ */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9ff",
            p: 4
          }}
        >
          <ErrorState
            message={this.state.error?.message || "Something went wrong while loading this page."}
            onRetry={this.handleRetry}
          />
        </Box>
      );
    }

    return this.props.children;
  }
}

/* ============================================
   PAGE FALLBACK LOADER
   Shows skeleton while page is loading
   ============================================ */

function PageFallback() {
  return (
    <Box sx={{ minHeight: "80vh", background: "#f8f9ff" }}>
      <PageSkeleton />
    </Box>
  );
}

/* ============================================
   LAYOUT WRAPPER
   Handles navbar/footer visibility
   ============================================ */

function Layout() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  const isProviderStandalone =
    location.pathname === "/provider" || location.pathname.startsWith("/provider/");

  /* Pages without navbar/footer */
  const hideLayout = isProviderStandalone || [
    "/login",
    "/register",
    "/supplier-landing",
    "/supplier-register",
    "/supplier-dashboard"
  ].includes(location.pathname);

  /* Track navigation for smooth transitions */
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Box
        sx={{
          opacity: isNavigating ? 0.7 : 1,
          transition: "opacity 0.3s ease"
        }}
      >
        {!hideLayout && <Navbar />}

        <Box
          sx={{
            minHeight: "80vh",
            pt: hideLayout ? 0 : { xs: "68px", md: "68px" }
          }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Services */}
              <Route path="/services" element={<Services />} />
              <Route path="/services/page/:pageId" element={<Services />} />
              <Route path="/category/:slug" element={<CategoryPage />} />

              {/* Service details */}
              <Route path="/service/:id" element={<ServiceDetails />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/service-details/:id" element={<ServiceDetails />} />

              {/* Cart */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/:serviceId" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Provider - Standalone pages with their own layout */}
              <Route path="/provider/login" element={<ProviderLogin />} />
              <Route path="/provider/forgot-password" element={<ForgotPassword />} />
              <Route path="/provider/reset-password/:token" element={<ResetPassword />} />
              <Route path="/provider/register" element={<ProviderRegister />} />
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/notifications" element={<Notifications />} />
              <Route path="/provider/add-service" element={<AddService />} />
              <Route path="/provider/my-services" element={<MyServices />} />
              <Route path="/provider/my-services/:id/edit" element={<EditService />} />
              <Route path="/provider/bookings" element={<ProviderBookings />} />
              <Route path="/provider/wallet" element={<Wallet />} />
              <Route path="/provider/verification" element={<ProviderVerification />} />
              <Route path="/provider/tickets" element={<ProviderTickets />} />
              <Route path="/provider/profile" element={<ProviderProfile />} />
              <Route path="/provider" element={<ProviderHome />} />

              {/* Profile */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/change-email" element={<ChangeEmail />} />
              <Route path="/change-phone" element={<ChangePhone />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/reviews" element={<MyReviews />} />
              <Route path="/support" element={<Support />} />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "60vh",
                      gap: 2
                    }}
                  >
                    <Box sx={{ fontSize: 80 }}>🔍</Box>
                    <Box sx={{ fontSize: 24, fontWeight: 600 }}>Page Not Found</Box>
                    <Box sx={{ color: "text.secondary", mb: 2 }}>
                      The page you're looking for doesn't exist.
                    </Box>
                    <a
                      href="/"
                      className="btn btn-primary"
                      style={{ textDecoration: "none", padding: "12px 24px" }}
                    >
                      Go Home
                    </a>
                  </Box>
                }
              />
            </Routes>
          </Suspense>
        </Box>

        {!hideLayout && <Footer />}
      </Box>
    </ErrorBoundary>
  );
}

/* ============================================
   MAIN APP
   ============================================ */

export default function App() {
  const [loading, setLoading] = useState(true);

  /* Initial page load animation */
  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <LoadingProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </NotificationProvider>
        </LoadingProvider>
      </CartProvider>
    </AuthProvider>
  );
}
