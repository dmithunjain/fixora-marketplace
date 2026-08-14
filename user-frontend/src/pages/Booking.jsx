import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Booking() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    time: "",
    address: ""
  });

  const handlePayment = () => {
    alert("Payment Successful!");
    clearCart();
    navigate("/");
  };

  return (
    <Box sx={{ px: 6, py: 4 }}>
      <Typography variant="h4" mb={3}>
        Booking Details
      </Typography>

      {cart.map((item) => (
        <Paper key={item.cartId} sx={{ p: 2, mb: 2 }}>
          {item.name} - ₹{item.price}
        </Paper>
      ))}

      <Typography fontWeight={700}>
        Total: ₹{totalPrice}
      </Typography>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Select Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Time Slot"
            select
            SelectProps={{ native: true }}
            fullWidth
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          >
            <option value="">Select</option>
            <option>9 AM - 12 PM</option>
            <option>12 PM - 3 PM</option>
            <option>3 PM - 6 PM</option>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            multiline
            rows={3}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value
              })
            }
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handlePayment}
      >
        Pay Now
      </Button>
    </Box>
  );
}