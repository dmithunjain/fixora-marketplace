import { useState, useEffect } from "react";
import { Box, Typography, Button, Skeleton, Pagination, LinearProgress } from "@mui/material";
import ReviewCard from "./ReviewCard";
import WriteReview from "./WriteReview";
import StarRating from "./StarRating";
import { reviewAPI } from "../services/api";

const ServiceReviews = ({ 
  serviceId, 
  providerId, 
  showWriteButton = true,
  canReview = false
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, ratingDistribution: {} });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);

  const fetchReviews = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await reviewAPI.getServiceReviews(serviceId, { 
        page: pageNum, 
        limit: 5 
      });
      setReviews(response.data.reviews);
      setStats({
        averageRating: response.data.averageRating,
        totalReviews: response.data.totalReviews,
        ratingDistribution: response.data.ratingDistribution
      });
      setTotalPages(response.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchReviews();
    }
  }, [serviceId]);

  const handlePageChange = (event, value) => {
    fetchReviews(value);
  };

  const handleHelpful = async (reviewId) => {
    try {
      await reviewAPI.markHelpful(reviewId);
    } catch (err) {
      console.error("Failed to mark helpful");
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews(1);
  };

  const ratingBars = [5, 4, 3, 2, 1];

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Customer Reviews
        </Typography>
        {showWriteButton && canReview && (
          <Button 
            variant="contained"
            onClick={() => setWriteReviewOpen(true)}
            sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
          >
            Write a Review
          </Button>
        )}
      </Box>

      {loading ? (
        <Box>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
          ))}
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Box sx={{ 
            display: 'flex', 
            gap: 4, 
            mb: 4, 
            p: 3, 
            bgcolor: '#f9fafb', 
            borderRadius: 2,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h3" fontWeight={800}>
                {stats.averageRating}
              </Typography>
              <StarRating rating={stats.averageRating} size="small" showValue={false} />
              <Typography variant="body2" color="text.secondary">
                {stats.totalReviews} reviews
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minWidth: 200 }}>
              {ratingBars.map((rating) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ width: 20 }}>{rating}</Typography>
                  <StarRating rating={rating} size="small" showValue={false} color="#ffb400" />
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.ratingDistribution[rating] || 0) / (stats.totalReviews || 1) * 100}
                    sx={{ 
                      flex: 1, 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': { bgcolor: '#ffb400' }
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ width: 30 }}>
                    {stats.ratingDistribution[rating] || 0}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {reviews.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to review this service!
              </Typography>
            </Box>
          ) : (
            <>
              {reviews.map((review) => (
                <ReviewCard 
                  key={review._id} 
                  review={review} 
                  onHelpful={handleHelpful}
                />
              ))}
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}

      <WriteReview
        open={writeReviewOpen}
        onClose={() => setWriteReviewOpen(false)}
        serviceId={serviceId}
        providerId={providerId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </Box>
  );
};

export default ServiceReviews;
