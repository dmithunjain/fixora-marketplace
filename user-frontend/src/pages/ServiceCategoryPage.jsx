import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { services } from "../data/services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bathroomHero from "../assets/Bathroom-Cleaning.jpg";

export default function ServiceCategoryPage() {
  const { cart, addToCart, updateQty, removeFromCart } = useCart();
  const [activeTab, setActiveTab] = useState("combos");
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const combos = services.filter(
    (s) => s.category === "cleaning"
  );

  const miniServices = services.filter(
    (s) => s.category === "mini"
  );

  const renderService = (service) => {
    const existing = cart.find(
      (item) => item.id === service.id
    );

    return (
      <Paper
        key={service.id}
        sx={{
          p: 3,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 3,
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
          }
        }}
      >
        <Box>
          <Typography fontWeight={600}>
            {service.name}
          </Typography>
          <Typography color="text.secondary">
            ₹{service.price}
          </Typography>
        </Box>

        {existing ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                if (existing.qty === 1) {
                  removeFromCart(service.id);
                } else {
                  updateQty(service.id, existing.qty - 1);
                }
              }}
            >
              -
            </Button>

            <Typography>{existing.qty}</Typography>

            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                updateQty(service.id, existing.qty + 1)
              }
            >
              +
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            onClick={() => addToCart(service)}
          >
            Add
          </Button>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
      <Grid container spacing={4}>

        {/* LEFT SIDE */}
        <Grid item xs={12} md={8}>

          {/* HERO */}
          <Paper sx={{ mb: 4, borderRadius: 4, overflow: "hidden" }}>
            <img
              src={bathroomHero}
              alt="Bathroom Cleaning"
              style={{
                width: "100%",
                height: 350,
                objectFit: "cover"
              }}
            />
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">
                Bathroom Cleaning
              </Typography>
              <Typography color="text.secondary">
                4.8 ⭐ (2M+ bookings)
              </Typography>
            </Box>
          </Paper>

          {/* TABS */}
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              variant={activeTab === "combos" ? "contained" : "outlined"}
              onClick={() => setActiveTab("combos")}
            >
              Combos
            </Button>

            <Button
              variant={activeTab === "mini" ? "contained" : "outlined"}
              onClick={() => setActiveTab("mini")}
            >
              Mini Services
            </Button>
          </Box>

          {/* SERVICES */}
          {activeTab === "combos" &&
            combos.map(renderService)}

          {activeTab === "mini" &&
            miniServices.map(renderService)}

        </Grid>

        {/* RIGHT STICKY CART */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              position: "sticky",
              top: 100,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
            }}
          >
            <Typography variant="h6">
              Your Cart
            </Typography>

            <Divider sx={{ my: 2 }} />

            {cart.length === 0 && (
              <Typography color="text.secondary">
                No items added
              </Typography>
            )}

            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1
                }}
              >
                <Typography>
                  {item.name} x {item.qty}
                </Typography>
                <Typography>
                  ₹{item.price * item.qty}
                </Typography>
              </Box>
            ))}

            {cart.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={700}>
                  Total: ₹{total}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}