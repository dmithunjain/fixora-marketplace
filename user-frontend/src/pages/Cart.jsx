import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { CartSkeleton } from "../components/SkeletonLoader";
import { useState, useEffect } from "react";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for smooth UX
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const delivery = subtotal > 0 ? 49 : 0;
  const total = subtotal + delivery;

  if (loading) {
    return <CartSkeleton />;
  }

  return (
    <Box
      sx={{
        background: "#f8f9ff",
        minHeight: "100vh",
        py: 4
      }}
    >
      <Box sx={{ px: { xs: 2, md: 8 }}}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 4,
            background: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          🛒 Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
        </Typography>

        {cart.length === 0 ? (
          <Card sx={{ borderRadius: "16px", textAlign: "center", py: 8 }}>
            <CardContent>
              <ShoppingCartIcon sx={{ fontSize: 80, color: "#d1d5db", mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#6b7280" }}>
                Your cart is empty
              </Typography>
              <Typography sx={{ color: "#9ca3af", mb: 3 }}>
                Add some services to get started!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/services")}
                sx={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5
                }}
              >
                Browse Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 4
            }}
          >
            {/* LEFT CART ITEMS */}
            <Box>
              {cart.map((item) => (
                <Card
                  key={item.cartId || item.id}
                  sx={{
                    mb: 2,
                    borderRadius: "16px",
                    "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
                    transition: "box-shadow 0.2s ease"
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      {/* IMAGE */}
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 12
                        }}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="600" sx={{ mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
                          ₹{item.price} per service
                        </Typography>
                      </Box>

                      {/* QUANTITY */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          bgcolor: "#f3f4f6",
                          borderRadius: "24px",
                          p: 0.5
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => decreaseQty(item.cartId || item.id)}
                          sx={{
                            bgcolor: "white",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ px: 2, fontWeight: 600, minWidth: 30, textAlign: "center" }}>
                          {item.qty}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => increaseQty(item.cartId || item.id)}
                          sx={{
                            bgcolor: "white",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* PRICE */}
                      <Typography sx={{ fontWeight: 700, fontSize: 18, minWidth: 80, textAlign: "right" }}>
                        ₹{item.price * item.qty}
                      </Typography>

                      {/* DELETE */}
                      <IconButton
                        onClick={() => removeFromCart(item.cartId || item.id)}
                        sx={{
                          color: "#dc2626",
                          "&:hover": { bgcolor: "#fef2f2" }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {cart.length > 0 && (
                <Button
                  color="error"
                  onClick={clearCart}
                  sx={{ mt: 2 }}
                >
                  Clear Cart
                </Button>
              )}
            </Box>

            {/* RIGHT SUMMARY */}
            <Card sx={{ borderRadius: "16px", height: "fit-content", position: "sticky", top: 100 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: "#6b7280", mb: 1, fontSize: 14 }}>
                    Promo code
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      placeholder="Enter code..."
                      size="small"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px"
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        background: "#1a1a2e",
                        borderRadius: "8px",
                        "&:hover": { background: "#374151" }
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography sx={{ color: "#6b7280" }}>Subtotal</Typography>
                  <Typography fontWeight={600}>₹{subtotal}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography sx={{ color: "#6b7280" }}>Delivery</Typography>
                  <Typography fontWeight={600}>₹{delivery}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 2,
                    my: 2,
                    borderTop: "1px dashed #e5e7eb",
                    borderBottom: "1px dashed #e5e7eb"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#4f46e5" }}>
                    ₹{total}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    py: 2,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    fontSize: 16,
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)"
                    }
                  }}
                  onClick={() => {
                    const primary = cart[0];
                    const primaryId = primary?._id || primary?.id || primary?.cartId;
                    if (!primaryId) {
                      navigate("/services");
                      return;
                    }
                    navigate(`/checkout/${primaryId}`, { state: { service: primary } });
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Typography sx={{ textAlign: "center", mt: 2, fontSize: 12, color: "#9ca3af" }}>
                  Secure checkout powered by Fixora
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}
