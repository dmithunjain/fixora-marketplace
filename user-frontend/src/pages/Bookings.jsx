import { useState, useEffect, useContext } from "react";
import { Box, Typography, Card, CardContent, Chip, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { bookingAPI, reviewAPI } from "../services/api";
import { BookingsSkeleton } from "../components/SkeletonLoader";
import WriteReview from "../components/WriteReview";
import StarRating from "../components/StarRating";
import "./Bookings.css";

export default function Bookings() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const response = await bookingAPI.getUserBookings();
        setBookings(response.data);
        
        // Fetch user's reviews to check which services have been reviewed
        try {
          const reviewsRes = await reviewAPI.getUserReviews();
          const reviewedServiceIds = reviewsRes.data.reviews.map(r => r.service?._id || r.service);
          setUserReviews(reviewedServiceIds);
        } catch (reviewErr) {
          console.log("Could not fetch user reviews");
        }
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      assigned: 'info',
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const handleDownloadInvoice = (booking) => {
    const bookingId = String(booking._id || '').slice(-8).toUpperCase();
    const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${bookingId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .company { font-size: 28px; font-weight: bold; color: #4f46e5; }
    .invoice-title { font-size: 24px; color: #666; }
    .invoice-number { font-size: 14px; color: #999; margin-top: 5px; }
    .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .details-box { background: #f9f9f9; padding: 20px; border-radius: 8px; width: 45%; }
    .details-box h4 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
    .details-box p { margin: 5px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th { background: #4f46e5; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .amount-section { margin-top: 30px; text-align: right; }
    .amount-row { display: flex; justify-content: flex-end; padding: 8px 0; }
    .amount-label { width: 150px; color: #666; }
    .amount-value { width: 100px; font-weight: bold; }
    .total { font-size: 18px; border-top: 2px solid #4f46e5; padding-top: 10px; }
    .total .amount-value { color: #4f46e5; font-size: 20px; }
    .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; background: ${booking.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7'}; color: ${booking.paymentStatus === 'paid' ? '#166534' : '#92400e'}; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">Fixora</div>
      <div class="invoice-number">Booking ID: ${bookingId}</div>
    </div>
    <div class="invoice-title">INVOICE</div>
  </div>
  
  <div class="details">
    <div class="details-box">
      <h4>BILL TO</h4>
      <p><strong>${booking.customerDetails?.name || 'Customer'}</strong></p>
      <p>${booking.customerDetails?.phone || ''}</p>
      <p>${[booking.address?.address, booking.address?.city, booking.address?.district, booking.address?.state, booking.address?.pincode].filter(Boolean).join(', ')}</p>
    </div>
    <div class="details-box">
      <h4>BOOKING DETAILS</h4>
      <p><strong>Service:</strong> ${booking.service?.name || 'Service'}</p>
      <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${booking.bookingTime}</p>
      <p><strong>Provider:</strong> ${booking.provider?.businessName || 'Assigned Provider'}</p>
      <p><strong>Status:</strong> <span class="status">${booking.status}</span></p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${booking.service?.name || 'Service'}</td>
        <td>1</td>
        <td>₹${booking.totalAmount?.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  
  <div class="amount-section">
    <div class="amount-row">
      <span class="amount-label">Subtotal</span>
      <span class="amount-value">₹${booking.totalAmount?.toLocaleString()}</span>
    </div>
    <div class="amount-row">
      <span class="amount-label">Platform Fee</span>
      <span class="amount-value">₹0</span>
    </div>
    <div class="amount-row total">
      <span class="amount-label">Total</span>
      <span class="amount-value">₹${booking.totalAmount?.toLocaleString()}</span>
    </div>
  </div>
  
  <div class="footer">
    <p>Thank you for booking with Fixora!</p>
    <p>This is a computer-generated invoice. No signature required.</p>
    <p>Fixora - Your Trusted Service Marketplace</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await bookingAPI.cancelBooking(bookingToCancel);
      setBookings(bookings.filter(b => b._id !== bookingToCancel));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const openCancelDialog = (bookingId) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const openReviewDialog = (booking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmitted = () => {
    if (selectedBooking) {
      setUserReviews(prev => [...prev, selectedBooking.service?._id || selectedBooking.service]);
    }
    setReviewDialogOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <Box sx={{ background: "linear-gradient(180deg, #f8fbff 0%, #fff 100%)", minHeight: "100vh", py: 4 }}>
        <BookingsSkeleton count={4} />
      </Box>
    );
  }

  return (
    <>
    <Box className="bookings-page-shell">
      <Box className="bookings-page-container">
        <Box className="bookings-header">
          <Typography variant="h4" className="bookings-title">
            My Bookings
          </Typography>
          <Typography className="bookings-subtitle">
            Track your service schedule, payment status, and provider updates in one place.
          </Typography>
        </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      {bookings.length === 0 ? (
        <Box className="bookings-empty-state">
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No bookings yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/services")}
            className="bookings-primary-btn"
          >
            Browse Services
          </Button>
        </Box>
      ) : (
        bookings.map((booking) => (
          <Card 
            key={booking._id} 
            className="booking-card"
          >
            <CardContent>
              <Box className="booking-card-head">
                <Box>
                  <Typography variant="h6" fontWeight={700} className="booking-service-title">
                    {booking.service?.name || 'Service'}
                  </Typography>
                  <Typography variant="body2" className="booking-id-text">
                    Booking ID: {String(booking._id || '').slice(-8).toUpperCase()}
                  </Typography>
                </Box>
                <Chip 
                  label={booking.status} 
                  color={getStatusColor(booking.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize', fontWeight: 700 }}
                />
              </Box>

              <Divider sx={{ my: 2.2 }} />

              <Box className="booking-meta-grid">
                <Box className="booking-meta-item">
                  <Typography variant="caption" className="booking-meta-label">Date</Typography>
                  <Typography variant="body2" className="booking-meta-value">
                    {formatDate(booking.bookingDate)}
                  </Typography>
                </Box>
                <Box className="booking-meta-item">
                  <Typography variant="caption" className="booking-meta-label">Time</Typography>
                  <Typography variant="body2" className="booking-meta-value">
                    {booking.bookingTime}
                  </Typography>
                </Box>
                <Box className="booking-meta-item">
                  <Typography variant="caption" className="booking-meta-label">Amount</Typography>
                  <Typography variant="body2" className="booking-meta-value">
                    ₹{booking.totalAmount}
                  </Typography>
                </Box>
                <Box className="booking-meta-item">
                  <Typography variant="caption" className="booking-meta-label">Payment</Typography>
                  <Chip 
                    label={booking.paymentStatus} 
                    size="small"
                    color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                    sx={{ textTransform: 'capitalize', mt: 0.5 }}
                  />
                </Box>
              </Box>

              {booking.provider && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Provider</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {booking.provider.businessName || 'Assigned Provider'}
                  </Typography>
                </Box>
              )}

              {(booking.address?.address || booking.address?.city || booking.address?.state) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Service Address</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {[booking.address?.address, booking.address?.city, booking.address?.district, booking.address?.state, booking.address?.pincode]
                      .filter(Boolean)
                      .join(', ')}
                  </Typography>
                </Box>
              )}

              {booking.customerDetails?.phone && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">Contact</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {booking.customerDetails?.name || 'Customer'} · {booking.customerDetails?.phone}
                  </Typography>
                </Box>
              )}

              {booking.status === 'completed' && (
                <Box className="booking-action-row">
                  {!userReviews.includes(booking.service?._id || booking.service) ? (
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => openReviewDialog(booking)}
                      sx={{ 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' }
                      }}
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarRating rating={5} size="small" showValue={false} />
                      <Typography variant="body2" color="text.secondary">Reviewed</Typography>
                    </Box>
                  )}
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => navigate(`/service/${booking.service?._id}`)}
                    className="booking-secondary-btn"
                  >
                    Book Again
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleDownloadInvoice(booking)}
                    sx={{ borderColor: '#10b981', color: '#10b981', textTransform: 'none' }}
                  >
                    Download Invoice
                  </Button>
                </Box>
              )}

              {['pending', 'confirmed'].includes(booking.status) && (
                <Box className="booking-action-row">
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => openCancelDialog(booking._id)}
                    className="booking-cancel-btn"
                  >
                    Cancel Booking
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleDownloadInvoice(booking)}
                    sx={{ borderColor: '#10b981', color: '#10b981', textTransform: 'none' }}
                  >
                    Download Invoice
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
      </Box>
    </Box>

    <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
      <DialogTitle>Cancel Booking</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to cancel this booking?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
        <Button onClick={handleCancel} color="error">Yes, Cancel</Button>
      </DialogActions>
    </Dialog>

    {selectedBooking && (
      <WriteReview
        open={reviewDialogOpen}
        onClose={() => {
          setReviewDialogOpen(false);
          setSelectedBooking(null);
        }}
        serviceId={selectedBooking.service?._id || selectedBooking.service}
        providerId={selectedBooking.provider?._id || selectedBooking.provider}
        onReviewSubmitted={handleReviewSubmitted}
      />
    )}
    </>
  );
}
