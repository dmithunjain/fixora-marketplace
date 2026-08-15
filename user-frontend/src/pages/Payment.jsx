import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { paymentAPI, bookingAPI } from "../services/api";

export default function Payment() {
  const navigate = useNavigate();
  const { id: bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [paymentData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Get booking details
        const bookingResponse = await bookingAPI.getBookingById(bookingId);
        const booking = bookingResponse.data;
        
        if (!booking) {
          setError("Booking not found");
          return;
        }

        // Create Razorpay order
        const paymentResponse = await paymentAPI.createOrder(
          booking.totalAmount,
          booking._id
        );
        const paymentData = paymentResponse.data;

        // Initialize Razorpay
        if (window.Razorpay) {
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_your_key_id_here",
            amount: paymentData.amount * 100, // amount in paise
            currency: paymentData.currency,
            name: "Fixora",
            description: `Payment for service booking #${bookingId?.toString().slice(-8).toUpperCase()}`,
            order_id: paymentData.id,
            handler: async function(response) {
              try {
                // Verify payment on backend
                const verifyResponse = await paymentAPI.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
                
                if (verifyResponse.data) {
                  setPaymentSuccess(true);
                  // Update booking status to confirmed
                  await bookingAPI.updateStatus(bookingId, 'confirmed');
                  await bookingAPI.updatePayment(bookingId, 'paid', 'razorpay');
                } else {
                  setPaymentFailed(true);
                }
              } catch (err) {
                console.error("Payment verification error:", err);
                setPaymentFailed(true);
              }
            },
            prefill: {
              name: "", // Would come from user profile
              email: "", // Would come from user profile
              contact: "" // Would come from user profile
            },
            theme: {
              color: "#4f46e5"
            }
          };
          
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } else {
          setError("Razorpay SDK not loaded");
        }
      } catch (err) {
        console.error("Payment initialization error:", err);
        setError(err.response?.data?.message || "Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [bookingId, navigate]);

  const handlePayAgain = () => {
    // Reset state and try again
    setPaymentSuccess(false);
    setPaymentFailed(false);
    setLoading(true);
    // Re-run the effect by changing bookingId temporarily
  };

  const handleBackToBookings = () => {
    navigate("/bookings");
  };

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h5">Processing payment...</Typography>
        <CircularProgress size={36} sx={{ mt: 3 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h5" color="error">Payment Error</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{error}</Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={handlePayAgain}>Try Again</Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleBackToBookings}>Back to Bookings</Button>
        </Box>
      </Box>
    );
  }

  if (paymentSuccess) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="success">Payment Successful!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your payment has been processed successfully.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Booking ID: #{bookingId?.toString().slice(-8).toUpperCase()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Amount: ₹{paymentData?.amount}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/service-details/${bookingId}`)}
          sx={{ 
            bgcolor: '#4f46e5', 
            '&:hover': { bgcolor: '#4338ca' }
          }}
        >
          View Booking Details
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleBackToBookings} 
          sx={{ ml: 2, mt: 2 }}
        >
          Back to Bookings
        </Button>
      </Box>
    );
  }

  if (paymentFailed) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="error">Payment Failed</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your payment could not be processed. Please try again.
          </Typography>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={handlePayAgain}>Try Again</Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleBackToBookings}>Back to Bookings</Button>
        </Box>
      </Box>
    );
  }

  // This shouldn't happen in normal flow, but just in case
  return (
    <Box sx={{ p: 6, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="h5">Preparing payment...</Typography>
    </Box>
  );
}