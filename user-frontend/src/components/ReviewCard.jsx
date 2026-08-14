import { Box, Typography, Avatar, Button, Divider } from "@mui/material";
import StarRating from "./StarRating";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useState } from "react";

const ReviewCard = ({ review, onHelpful }) => {
  const [helpful, setHelpful] = useState(false);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHelpful = () => {
    if (!helpful) {
      setHelpful(true);
      if (onHelpful) {
        onHelpful(review._id);
      }
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <Box sx={{ 
      p: 3, 
      mb: 2, 
      border: '1px solid #eee', 
      borderRadius: 2,
      bgcolor: '#fff',
      transition: 'box-shadow 0.3s',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#4f46e5', width: 48, height: 48 }}>
            {getInitials(review.user?.name)}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {review.user?.name || 'Anonymous'}
              </Typography>
              {review.isVerified && (
                <VerifiedIcon sx={{ fontSize: 16, color: '#22c55e' }} />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.createdAt)}
            </Typography>
          </Box>
        </Box>
        <StarRating 
          rating={review.rating} 
          size="small" 
          showValue={false}
        />
      </Box>

      {review.title && (
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {review.title}
        </Typography>
      )}

      {review.comment && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          {review.comment}
        </Typography>
      )}

      {review.images && review.images.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {review.images.map((img, idx) => (
            <Box
              key={idx}
              component="img"
              src={img}
              alt={`Review image ${idx + 1}`}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          size="small"
          startIcon={<ThumbUpAltIcon />}
          onClick={handleHelpful}
          disabled={helpful}
          sx={{ 
            color: helpful ? '#4f46e5' : '#666',
            textTransform: 'none'
          }}
        >
          Helpful {review.helpful > 0 && `(${review.helpful})`}
        </Button>
        
        {review.isVerified && (
          <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 500 }}>
            ✓ Verified Service
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ReviewCard;
