import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";

const StarRating = ({ 
  rating, 
  onRate, 
  size = "medium", 
  showValue = true, 
  color = "#ffb400",
  interactive = false,
  count = null
}) => {
  const sizeMap = {
    small: { fontSize: 18, boxSize: 24 },
    medium: { fontSize: 24, boxSize: 32 },
    large: { fontSize: 32, boxSize: 40 }
  };

  const iconSize = sizeMap[size]?.fontSize || 24;

  const renderStar = (index) => {
    const filled = index < Math.floor(rating);
    const halfFilled = !filled && index < rating;

    if (onRate && interactive) {
      return (
        <Box
          key={index}
          onClick={() => onRate(index + 1)}
          sx={{
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.2)' }
          }}
        >
          {filled ? (
            <StarIcon sx={{ fontSize: iconSize, color }} />
          ) : halfFilled ? (
            <StarHalfIcon sx={{ fontSize: iconSize, color }} />
          ) : (
            <StarBorderIcon sx={{ fontSize: iconSize, color: '#ddd' }} />
          )}
        </Box>
      );
    }

    return filled ? (
      <StarIcon key={index} sx={{ fontSize: iconSize, color }} />
    ) : halfFilled ? (
      <StarHalfIcon key={index} sx={{ fontSize: iconSize, color }} />
    ) : (
      <StarBorderIcon key={index} sx={{ fontSize: iconSize, color: '#ddd' }} />
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ display: 'flex', gap: 0.2 }}>
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </Box>
      {showValue && (
        <Typography 
          variant="body2" 
          sx={{ ml: 1, fontWeight: 600, color: '#333' }}
        >
          {rating?.toFixed(1) || '0.0'}
          {count !== null && (
            <Typography component="span" sx={{ fontWeight: 400, color: '#666', ml: 0.5 }}>
              ({count})
            </Typography>
          )}
        </Typography>
      )}
    </Box>
  );
};

export default StarRating;
