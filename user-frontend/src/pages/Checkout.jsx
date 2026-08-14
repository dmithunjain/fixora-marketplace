import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Radio,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import GPayIcon from "@mui/icons-material/Payments";
import { paymentAPI, publicServiceAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

export default function Checkout() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart } = useCart();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [savedLocation] = useState(() => {
    const saved = localStorage.getItem('fixoraLocation');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedDate, setSelectedDate] = useState(location.state?.date || "");
  const [selectedTime, setSelectedTime] = useState(location.state?.time || "");
  const [addressLine, setAddressLine] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [customerDetails, setCustomerDetails] = useState(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      return { name: "", email: "", phone: "" };
    }
    try {
      const parsed = JSON.parse(userInfo);
      return {
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || ""
      };
    } catch (error) {
      return { name: "", email: "", phone: "" };
    }
  });
  
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [userUpiId, setUserUpiId] = useState("");
  const [upiPin, setUpiPin] = useState("");
  
  const [upiPayment, setUpiPayment] = useState(null);
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolderName: "",
    bankName: ""
  });
  const [cardErrors, setCardErrors] = useState({});
  const [cardLoading, setCardLoading] = useState(false);

  // Handle card number - numbers only, format with spaces (1234 5678 9012 3456)
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails(prev => ({ ...prev, cardNumber: formatted }));
    setCardErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  // Handle CVV - numbers only, max 4 digits
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails(prev => ({ ...prev, cvv: value }));
    setCardErrors(prev => ({ ...prev, cvv: '' }));
  };

  // Handle expiry - format as MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardDetails(prev => ({ ...prev, expiry: value }));
    setCardErrors(prev => ({ ...prev, expiry: '' }));
  };

  // Handle cardholder name - letters and spaces only
  const handleCardHolderChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    setCardDetails(prev => ({ ...prev, cardHolderName: value }));
    setCardErrors(prev => ({ ...prev, cardHolderName: '' }));
  };
  
  const [codLoading, setCodLoading] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        if (location.state?.service) {
          setService(location.state.service);
          return;
        }

        if (serviceId) {
          const res = await publicServiceAPI.getServiceById(serviceId);
          const data = res?.data || res;
          if (data) {
            setService({
              ...data,
              _id: data._id || data.id,
              name: data.title || data.name,
              title: data.title || data.name,
              image: (data.images && data.images[0]) || data.image,
              category: data.category || data.categoryId
            });
            return;
          }
        }

        if (cart.length > 0) {
          const cartItem = cart[0];
          setService({
            ...cartItem,
            _id: cartItem._id || cartItem.id,
            name: cartItem.name || cartItem.title,
            title: cartItem.title || cartItem.name
          });
          return;
        }

        setService(null);
      } catch (error) {
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId, location.state, cart]);

  const payableAmount = Number(service?.price || 0) + 10;
  const bookingAddress = {
    state: savedLocation?.state || "",
    district: savedLocation?.district || "",
    city: savedLocation?.city || "",
    pincode: savedLocation?.pincode || "",
    address: addressLine
  };

  const validateBookingPayload = () => {
    if (!service?._id) {
      setSnackbar({ open: true, message: "Please select a valid service", severity: "error" });
      return false;
    }
    if (!selectedDate || !selectedTime) {
      setSnackbar({ open: true, message: "Please choose booking date and time", severity: "error" });
      return false;
    }
    if (!bookingAddress.state || !bookingAddress.city || !bookingAddress.pincode || !bookingAddress.address) {
      setSnackbar({ open: true, message: "Please enter complete service address", severity: "error" });
      return false;
    }
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.email) {
      setSnackbar({ open: true, message: "Please fill contact details", severity: "error" });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (upiPayment && !upiPaid && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [upiPayment, upiPaid]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateUPI = async () => {
    if (!validateBookingPayload()) {
      return;
    }
    setUpiLoading(true);
    try {
      const response = await paymentAPI.createUPI({
        serviceId: service._id,
        amount: payableAmount,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        address: bookingAddress,
        customerDetails,
        notes: bookingNotes
      });
      setUpiPayment(response.data);
      setTimeLeft(300);
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Failed to create UPI payment", severity: "error" });
    } finally {
      setUpiLoading(false);
    }
  };

  const handleUPIPaid = async () => {
    if (!userUpiId) {
      setSnackbar({ open: true, message: "Please enter your UPI ID", severity: "error" });
      return;
    }
    if (!upiPin || upiPin.length !== 6) {
      setSnackbar({ open: true, message: "Please enter your 6-digit UPI PIN", severity: "error" });
      return;
    }
    
    // Direct payment with UPI ID and PIN
    setUpiLoading(true);
    try {
      const response = await paymentAPI.createUPI({
        serviceId: service._id,
        amount: payableAmount,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        address: bookingAddress,
        customerDetails,
        notes: bookingNotes,
        upiId: userUpiId,
        upiPin: upiPin
      });
      
      setUpiPaid(true);
      setPaymentSuccess(true);
      if (service?.cartId || service.id) {
        removeFromCart(service.cartId || service.id);
      }
      setSnackbar({ open: true, message: "Payment successful! Booking confirmed.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Payment failed. Please check your UPI ID and PIN.", severity: "error" });
    } finally {
      setUpiLoading(false);
    }
  };

  const confirmUPIPayment = async () => {
    try {
      await paymentAPI.markPaid(upiPayment.paymentId, {
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        address: bookingAddress,
        customerDetails,
        notes: bookingNotes
      });
      setUpiPaid(true);
      setPaymentSuccess(true);
      if (service?.cartId || service?.id) {
        removeFromCart(service.cartId || service.id);
      }
      setSnackbar({ open: true, message: "Payment successful! Booking confirmed.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Failed to confirm payment", severity: "error" });
    } finally {
      setConfirmDialog(false);
    }
  };

  const copyUPIID = () => {
    navigator.clipboard.writeText("fixora@upi");
    setSnackbar({ open: true, message: "UPI ID copied!", severity: "success" });
  };

  const handleCardPayment = async () => {
    if (!validateBookingPayload()) {
      return;
    }
    
    // Validate card details
    const errors = {};
    const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
    
    if (!cardNum || cardNum.length < 13) {
      errors.cardNumber = "Enter valid card number (13-16 digits)";
    }
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      errors.expiry = "Enter valid expiry (MM/YY)";
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      errors.cvv = "Enter valid CVV (3-4 digits)";
    }
    if (!cardDetails.cardHolderName || cardDetails.cardHolderName.trim().length < 2) {
      errors.cardHolderName = "Enter cardholder name";
    }

    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      return;
    }

    setCardLoading(true);
    try {
      const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
      await paymentAPI.createCard({
        serviceId: service._id,
        amount: payableAmount,
        cardDetails: {
          cardNumber: cardNum,
          expiry: cardDetails.expiry,
          cvv: cardDetails.cvv,
          cardHolderName: cardDetails.cardHolderName.trim().toUpperCase(),
          bankName: cardDetails.bankName
        },
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        address: bookingAddress,
        customerDetails,
        notes: bookingNotes
      });
      
      setPaymentSuccess(true);
      if (service?.cartId || service?.id) {
        removeFromCart(service.cartId || service.id);
      }
      setSnackbar({ open: true, message: "Payment successful! Booking confirmed.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Payment failed", severity: "error" });
    } finally {
      setCardLoading(false);
    }
  };

  const handleCOD = async () => {
    if (!validateBookingPayload()) {
      return;
    }
    setCodLoading(true);
    try {
      await paymentAPI.createCOD({
        serviceId: service._id,
        amount: payableAmount,
        address: bookingAddress,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        customerDetails,
        notes: bookingNotes
      });
      setPaymentSuccess(true);
      if (service?.cartId || service?.id) {
        removeFromCart(service.cartId || service.id);
      }
      setSnackbar({ open: true, message: "Booking confirmed! Pay cash on service.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Booking failed", severity: "error" });
    } finally {
      setCodLoading(false);
    }
  };

  const progressStep = paymentSuccess ? 2 : 1;

  const paymentOptions = [
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCardIcon /> },
    { id: 'upi', label: 'UPI Payment', icon: <QrCodeIcon /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <AccountBalanceWalletIcon /> }
  ];

  if (loading) {
    return (
      <Box className="checkout-page">
        <Box className="checkout-container">
          <Skeleton variant="text" width={300} height={40} sx={{ mb: 4 }} />
          <Box className="checkout-grid">
            <Box className="checkout-loading">
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px' }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '16px' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!service) {
    return (
      <Box className="checkout-not-found">
        <Typography variant="h5">Service not found</Typography>
      </Box>
    );
  }

  return (
    <Box className="checkout-page">
      <Box className="checkout-container">
        <Box className="checkout-header">
          <Typography className="checkout-title">Secure Checkout</Typography>
          <Typography className="checkout-subtitle">Complete your booking with verified payment and instant confirmation.</Typography>
        </Box>

        <Stepper activeStep={progressStep} className="checkout-stepper">
          <Step>
            <StepLabel>Personal Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        <Box className="checkout-grid">
          {/* Left Column - Payment */}
          <Box className="payment-section">
            {/* Booking Details Card */}
            <Box className="booking-details-card">
              <h3>Booking Details</h3>
              <Box className="booking-form-grid">
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  className="checkout-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                />
                <TextField
                  fullWidth
                  select
                  label="Time Slot"
                  className="checkout-input"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Time</option>
                  {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"].map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Full Name"
                  className="checkout-input"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  className="checkout-input"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails((prev) => ({ ...prev, phone: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Email"
                  className="checkout-input full-width"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))}
                />
                <TextField
                  fullWidth
                  label="Full Address"
                  className="checkout-input full-width"
                  placeholder="House number, street, landmark"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  className="checkout-input full-width"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </Box>
            </Box>

            {/* Payment Methods Card */}
            <Box className="payment-methods-card">
              <h3>Payment Method</h3>
              
              {!paymentSuccess ? (
                <>
                  <Box className="payment-options-list">
                    {paymentOptions.map((option) => (
                      <Box
                        key={option.id}
                        className={`payment-option-card ${paymentMethod === option.id ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(option.id)}
                      >
                        <Radio 
                          checked={paymentMethod === option.id} 
                          className="radio-check"
                        />
                        <Box className="method-icon">{option.icon}</Box>
                        <Typography className="method-name">{option.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Payment Forms */}
                  {paymentMethod === 'upi' && (
                    <Box className="payment-form-section">
                      <h4>Enter UPI Payment Details</h4>
                      <TextField
                        fullWidth
                        label="Your UPI ID"
                        placeholder="yourname@upi"
                        className="checkout-input"
                        value={userUpiId}
                        onChange={(e) => setUserUpiId(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="6-digit UPI PIN"
                        type="password"
                        placeholder="Enter 6-digit PIN"
                        className="checkout-input"
                        value={upiPin}
                        onChange={(e) => setUpiPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                        sx={{ mb: 3 }}
                      />
                      <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleUPIPaid}
                        disabled={upiPaid || !userUpiId || !upiPin || upiPin.length !== 6}
                        startIcon={<CheckCircleIcon />}
                        className="checkout-primary-btn"
                        style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}
                      >
                        {upiPaid ? "Payment Confirmed!" : "Pay Now"}
                      </Button>
                      <Typography variant="body2" sx={{ mt: 2, color: '#666', textAlign: 'center', fontSize: '12px' }}>
                        By clicking "Pay Now", you authorize the payment of ₹{payableAmount} via UPI.
                      </Typography>
                    </Box>
                  )}

                  {paymentMethod === 'card' && (
                    <Box className="payment-form-section">
                      <h4>Card Details</h4>
                      <Box className="card-form-grid">
                        <TextField
                          fullWidth
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          className="checkout-input full-width"
                          value={cardDetails.cardNumber}
                          onChange={handleCardNumberChange}
                          inputProps={{ maxLength: 19, inputMode: 'numeric' }}
                          error={!!cardErrors.cardNumber}
                          helperText={cardErrors.cardNumber}
                        />
                        <TextField
                          fullWidth
                          label="MM/YY"
                          placeholder="12/25"
                          className="checkout-input"
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                          inputProps={{ maxLength: 5, inputMode: 'numeric' }}
                          error={!!cardErrors.expiry}
                          helperText={cardErrors.expiry}
                        />
                        <TextField
                          fullWidth
                          label="CVV"
                          type="password"
                          placeholder="123"
                          className="checkout-input"
                          value={cardDetails.cvv}
                          onChange={handleCvvChange}
                          inputProps={{ maxLength: 4, inputMode: 'numeric' }}
                          error={!!cardErrors.cvv}
                          helperText={cardErrors.cvv}
                        />
                        <TextField
                          fullWidth
                          label="Cardholder Name"
                          placeholder="JOHN DOE"
                          className="checkout-input full-width"
                          value={cardDetails.cardHolderName}
                          onChange={handleCardHolderChange}
                          inputProps={{ maxLength: 50 }}
                          error={!!cardErrors.cardHolderName}
                          helperText={cardErrors.cardHolderName}
                        />
                        <TextField
                          fullWidth
                          select
                          label="Select Bank"
                          className="checkout-input full-width"
                          value={cardDetails.bankName}
                          onChange={(e) => setCardDetails({...cardDetails, bankName: e.target.value})}
                          SelectProps={{ native: true }}
                        >
                          <option value="">Select Bank</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="HDFC">HDFC Bank</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="Axis">Axis Bank</option>
                          <option value="Kotak">Kotak Bank</option>
                        </TextField>
                      </Box>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleCardPayment} 
                        disabled={cardLoading} 
                        className="checkout-primary-btn"
                      >
                        {cardLoading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${payableAmount}`}
                      </Button>
                    </Box>
                  )}

                  {paymentMethod === 'cod' && (
                    <Box className="payment-form-section">
                      <Box className="cod-info">
                        <p>Pay ₹{payableAmount} in cash to the service provider after service completion.</p>
                      </Box>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleCOD} 
                        disabled={codLoading} 
                        className="checkout-primary-btn"
                      >
                        {codLoading ? <CircularProgress size={24} color="inherit" /> : "Confirm Booking (COD)"}
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <Box className="payment-success-wrap">
                  <Box className="success-icon-large">
                    <CheckCircleIcon />
                  </Box>
                  <Typography className="success-title">Payment Successful!</Typography>
                  <Typography className="success-message">
                    Your booking has been confirmed. You will receive a confirmation shortly.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/')} 
                    className="checkout-primary-btn"
                  >
                    Go to Home
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Column - Order Summary */}
          <Box className="order-summary-section">
            <Box className="checkout-card">
              <Box className="card-header">
                <h3>Order Summary</h3>
              </Box>
              <Box className="card-body">
                {/* Service Item */}
                <Box className="service-item-card">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="service-item-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/70'; }}
                  />
                  <Box className="service-item-details">
                    <Typography className="service-item-title">{service.name}</Typography>
                    <Typography className="service-item-category">{service.category}</Typography>
                  </Box>
                  <Typography className="service-item-price">₹{service.price}</Typography>
                </Box>

                {/* Location & Schedule */}
                {savedLocation && (
                  <Box className="location-schedule-card" style={{ marginBottom: '16px', padding: '16px' }}>
                    <Box className="location-item">
                      <LocationOnIcon />
                      <Box>
                        <h5>Service Location</h5>
                        <p>{savedLocation.city}, {savedLocation.state}</p>
                      </Box>
                    </Box>
                    <Box className="schedule-item">
                      <EventIcon />
                      <Box>
                        <h5>Schedule</h5>
                        <p>{selectedDate || "Not set"} at {selectedTime || "Not set"}</p>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Divider />

                {/* Summary Rows */}
                <Box className="summary-rows">
                  <Box className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{service.price}</span>
                  </Box>
                  <Box className="summary-row">
                    <span>Tax</span>
                    <span>₹10</span>
                  </Box>
                  <Box className="summary-row total">
                    <span>Total</span>
                    <span>₹{payableAmount}</span>
                  </Box>
                </Box>

                <Button 
                  fullWidth 
                  variant="contained" 
                  className="checkout-primary-btn"
                  onClick={() => {
                    if (paymentMethod === 'card') handleCardPayment();
                    else if (paymentMethod === 'cod') handleCOD();
                    else handleUPIPaid();
                  }}
                >
                  {paymentSuccess ? "Booked!" : `Pay ₹${payableAmount}`}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog 
        open={confirmDialog} 
        onClose={() => setConfirmDialog(false)}
        className="confirm-dialog"
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography className="confirm-dialog-content">
            Have you completed the UPI payment of ₹{payableAmount} to fixora@upi?
          </Typography>
        </DialogContent>
        <DialogActions className="confirm-dialog-actions">
          <Button onClick={() => setConfirmDialog(false)}>Not Yet</Button>
          <Button 
            onClick={confirmUPIPayment} 
            variant="contained" 
            className="checkout-primary-btn"
            style={{ minWidth: '160px' }}
          >
            Yes, Payment Done
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
