import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SupportIcon from "@mui/icons-material/Support";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/provider/dashboard" },
  { id: "add-service", label: "Add Service", icon: <AddIcon />, path: "/provider/add-service" },
  { id: "services", label: "My Services", icon: <PersonIcon />, path: "/provider/my-services" },
  { id: "bookings", label: "Bookings", icon: <ReceiptIcon />, path: "/provider/dashboard#/bookings" },
  { id: "wallet", label: "Wallet", icon: <AccountBalanceWalletIcon />, path: "/provider/wallet" },
  { id: "tickets", label: "Support Tickets", icon: <SupportIcon />, path: "/provider/tickets" },
  { id: "settings", label: "Settings", icon: <SettingsIcon />, path: "/provider/dashboard#/settings" },
];

export default function ProviderLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const providerAuth = localStorage.getItem("providerAuth");
  const providerData = providerAuth ? JSON.parse(localStorage.getItem("providerData") || "{}") : null;

  const isActive = (path) => {
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      return location.pathname === basePath && location.hash === `#${hash}`;
    }
    return location.pathname === path;
  };

  const handleNavClick = (item) => {
    navigate(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem("providerAuth");
    localStorage.removeItem("providerData");
    navigate("/provider/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sidebar */}
      <Box sx={{
        width: 270,
        bgcolor: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 1000
      }}>
        {/* Logo & Profile */}
        <Box sx={{ p: 3, borderBottom: "1px solid #f3f4f6" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 20
            }}>
              {(providerData?.businessName || providerData?.name || "P")?.charAt(0).toUpperCase()}
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ color: "#111827", lineHeight: 1.3 }}>
                {providerData?.businessName || providerData?.name || "Provider"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }} noWrap>
                {providerData?.serviceCategory || "Service Provider"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              bgcolor: providerData?.isApproved ? "#d1fae5" : "#fef3c7",
              color: providerData?.isApproved ? "#059669" : "#d97706",
              fontWeight: 600,
              fontSize: 11
            }}
          >
            {providerData?.isApproved ? "Verified" : "Pending"}
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, py: 2, px: 2, overflowY: "auto" }}>
          <Stack spacing={0.5}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="text"
                startIcon={item.icon}
                onClick={() => handleNavClick(item)}
                sx={{
                  width: "100%",
                  justifyContent: "flex-start",
                  py: 1.5,
                  px: 2,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: 14,
                  color: isActive(item.path) ? "#667eea" : "#4b5563",
                  bgcolor: isActive(item.path) ? "#f0f4ff" : "transparent",
                  "&:hover": {
                    bgcolor: isActive(item.path) ? "#f0f4ff" : "#f9fafb",
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Logout */}
        <Box sx={{ p: 2, borderTop: "1px solid #f3f4f6" }}>
          <Button
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              py: 1.5,
              px: 2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              fontSize: 14,
              color: "#ef4444",
              "&:hover": {
                bgcolor: "#fef2f2",
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content - Outlet for nested routes */}
      <Box sx={{ flexGrow: 1, ml: "270px", p: 4, minHeight: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
