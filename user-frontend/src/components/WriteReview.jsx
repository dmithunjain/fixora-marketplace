import { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from "@mui/material";
import StarRating from "./StarRating";
import { reviewAPI } from "../services/api";

const WriteReview = ({ 
  open, 
  onClose, 
  serviceId, 
  providerId, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment || comment.length < 10) {
      setError("Please write a review (at least 10 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await reviewAPI.createReview({
        serviceId,
        providerId,
        rating,
        title: title.trim(),
        comment: comment.trim()
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setRating(0);
        setTitle("");
        setComment("");
        setSuccess(false);
        if (onReviewSubmitted) onReviewSubmitted();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setRating(0);
      setTitle("");
      setComment("");
      setError("");
      setSuccess(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Write a Review
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Thank you! Your review has been submitted successfully.
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 3, mt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                How was your experience? *
              </Typography>
              <StarRating 
                rating={rating} 
                onRate={setRating}
                interactive={true}
                size="large"
                showValue={false}
              />
              {rating > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </Typography>
              )}
            </Box>

            <TextField
              fullWidth
              label="Review Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 100 }}
              placeholder="Summarize your experience"
            />

            <TextField
              fullWidth
              label="Your Review *"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 500 }}
              placeholder="Share your experience with this service..."
              helperText={`${comment.length}/500 characters`}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            sx={{ 
              bgcolor: '#4f46e5',
              '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Review"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default WriteReview;
