import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reviewAPI } from "../services/api";

const StarIcon = ({ filled }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="18" 
    height="18" 
    fill={filled ? "#f59e0b" : "none"} 
    stroke={filled ? "#f59e0b" : "#9ca3af"} 
    strokeWidth="2"
    style={{ marginRight: "2px" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8f9ff",
    padding: "40px 20px"
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden"
  },
  header: {
    padding: "30px 40px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 8px 0"
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0
  },
  content: {
    padding: "30px 40px"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  error: {
    padding: "16px 20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    marginBottom: "20px"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px"
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px"
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px"
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px"
  },
  btnPrimary: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
    transition: "background-color 0.2s"
  },
  reviewCard: {
    padding: "24px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    transition: "box-shadow 0.2s"
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px"
  },
  serviceInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  serviceImage: {
    width: "70px",
    height: "70px",
    borderRadius: "8px",
    objectFit: "cover"
  },
  serviceTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 4px 0"
  },
  providerName: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0
  },
  reviewDate: {
    fontSize: "12px",
    color: "#9ca3af"
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
  },
  ratingNumber: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937"
  },
  reviewTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 8px 0"
  },
  reviewComment: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.6",
    margin: "0 0 12px 0"
  },
  reviewImages: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px"
  },
  reviewImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover"
  },
  helpfulCount: {
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "12px",
    display: "inline-block"
  },
  backLink: {
    display: "inline-block",
    marginTop: "20px",
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500"
  }
};

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getUserReviews();
      setReviews(response.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: "flex" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= rating} />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .btn-primary:hover {
          background-color: #4338ca !important;
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Reviews</h1>
          <p style={styles.subtitle}>Reviews you've given to services</p>
        </div>

        <div style={styles.content}>
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {reviews.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⭐</div>
              <h3 style={styles.emptyTitle}>No Reviews Yet</h3>
              <p style={styles.emptyText}>You haven't given any reviews yet. Complete a service booking to leave a review!</p>
              <Link to="/services" style={styles.btnPrimary}>
                Browse Services
              </Link>
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    {review.service && (
                      <div style={styles.serviceInfo}>
                        {review.service.images && review.service.images[0] && (
                          <img 
                            src={review.service.images[0]} 
                            alt={review.service.title}
                            style={styles.serviceImage}
                          />
                        )}
                        <div>
                          <h3 style={styles.serviceTitle}>{review.service.title}</h3>
                          {review.provider && (
                            <p style={styles.providerName}>by {review.provider.businessName}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <span style={styles.reviewDate}>{formatDate(review.createdAt)}</span>
                  </div>

                  <div style={styles.ratingRow}>
                    {renderStars(review.rating)}
                    <span style={styles.ratingNumber}>{review.rating}/5</span>
                  </div>

                  {review.title && (
                    <h4 style={styles.reviewTitle}>{review.title}</h4>
                  )}

                  {review.comment && (
                    <p style={styles.reviewComment}>{review.comment}</p>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div style={styles.reviewImages}>
                      {review.images.map((img, index) => (
                        <img key={index} src={img} alt={`Review ${index + 1}`} style={styles.reviewImage} />
                      ))}
                    </div>
                  )}

                  {review.helpful > 0 && (
                    <span style={styles.helpfulCount}>{review.helpful} people found this helpful</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <Link to="/profile" style={styles.backLink}>
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}