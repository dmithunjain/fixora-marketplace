import { Box, Skeleton, Grid, Stack, Card, CardContent, Divider } from "@mui/material";

/* ============================================
   SKELETON LOADER SYSTEM
   Premium skeleton loaders for smooth UX
   ============================================ */

/* Services Grid Skeleton */
export function ServicesSkeleton({ count = 8 }) {
  return (
    <Box>
      <Skeleton 
        variant="text" 
        width={200} 
        height={40} 
        sx={{ mb: 3, mx: "auto" }} 
      />
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <Skeleton
                variant="rectangular"
                height={180}
                animation="wave"
              />
              <Box sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="50%" height={18} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={16} />
                <Skeleton variant="text" width="60%" height={16} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 1.5 }}>
                  <Skeleton variant="text" width={80} height={28} />
                  <Skeleton variant="rectangular" width={60} height={36} sx={{ borderRadius: "20px" }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* Service Detail Page Skeleton */
export function ServiceDetailSkeleton() {
  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: "20px", mb: 2 }}
            animation="wave"
          />
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={4} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ borderRadius: "12px" }}
                  animation="wave"
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: "20px" }} />
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: "20px" }} />
          </Box>
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="70%" height={24} sx={{ mb: 3 }} />
          <Skeleton variant="text" width="40%" height={50} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: "12px", mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: "12px" }} />
        </Grid>
      </Grid>
    </Box>
  );
}

/* Dashboard Stats Skeleton */
export function DashboardStatsSkeleton() {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Card sx={{ borderRadius: "16px", p: 3 }}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} animation="wave" />
              </Box>
              <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={40} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/* Table Skeleton */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <Box sx={{ background: "#fff", borderRadius: "16px", overflow: "hidden" }}>
      <Box sx={{ p: 2, background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        <Grid container spacing={2}>
          {Array.from({ length: cols }).map((_, i) => (
            <Grid item xs={12 / cols} key={i}>
              <Skeleton variant="text" width="80%" height={16} />
            </Grid>
          ))}
        </Grid>
      </Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ p: 2, borderBottom: rowIndex < rows - 1 ? "1px solid #f3f4f6" : "none" }}>
          <Grid container spacing={2} alignItems="center">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Grid item xs={12 / cols} key={colIndex}>
                <Skeleton variant="text" width={colIndex === 0 ? "60%" : "80%"} height={20} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

/* Card List Skeleton */
export function CardListSkeleton({ count = 4 }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ borderRadius: "16px", p: 2 }}>
          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, display: "flex", gap: 2, alignItems: "center" }}>
            <Skeleton variant="circular" width={60} height={60} animation="wave" />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: "20px" }} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

/* Profile Skeleton */
export function ProfileSkeleton() {
  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
      <Box sx={{ 
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        borderRadius: "24px",
        p: 4,
        mb: 4
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Skeleton variant="circular" width={100} height={100} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={200} height={36} sx={{ bgcolor: "rgba(255,255,255,0.8)" }} />
            <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: "rgba(255,255,255,0.6)" }} />
          </Box>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: "16px" }} animation="wave" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/* Form Skeleton */
export function FormSkeleton() {
  return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} animation="wave" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} animation="wave" />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} animation="wave" />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2, maxWidth: 200 }} />
        </Grid>
      </Grid>
    </Box>
  );
}

/* Sidebar Navigation Skeleton */
export function SidebarSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Skeleton variant="rectangular" width={44} height={44} sx={{ borderRadius: 2 }} />
        <Skeleton variant="text" width={120} height={24} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={44} height={44} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
        </Box>
      </Box>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} variant="rectangular" height={44} sx={{ borderRadius: 2, mb: 1 }} animation="wave" />
      ))}
    </Box>
  );
}

/* Wallet Card Skeleton */
export function WalletSkeleton() {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3].map((i) => (
        <Grid item xs={12} md={4} key={i}>
          <Card sx={{ borderRadius: "16px", p: 4, textAlign: "center" }}>
            <Skeleton variant="circular" width={64} height={64} sx={{ mx: "auto", mb: 2 }} animation="wave" />
            <Skeleton variant="text" width="50%" height={16} sx={{ mx: "auto", mb: 1 }} />
            <Skeleton variant="text" width="40%" height={40} sx={{ mx: "auto" }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/* Ticket List Skeleton */
export function TicketListSkeleton({ count = 3 }) {
  return (
    <Stack spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ borderRadius: "16px", p: 3 }}>
          <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: "12px" }} />
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: "12px" }} />
              </Box>
              <Skeleton variant="text" width={100} height={24} />
            </Box>
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

/* Image with Lazy Loading Skeleton */
export function ImageSkeleton({ height = 200 }) {
  return (
    <Box
      sx={{
        width: "100%",
        height,
        background: "linear-gradient(110deg, #eceff1 8%, #f5f5f5 18%, #eceff1 33%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s linear infinite",
        borderRadius: 2,
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      }}
    />
  );
}

/* Hero Section Skeleton */
export function HeroSkeleton() {
  return (
    <Box sx={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: { xs: 0, md: "24px" },
      mx: { xs: 0, md: 4 },
      my: 2,
      p: 6,
      minHeight: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Box sx={{ textAlign: "center", maxWidth: 600 }}>
        <Skeleton variant="text" width="80%" height={56} sx={{ mx: "auto", bgcolor: "rgba(255,255,255,0.2)" }} />
        <Skeleton variant="text" width="60%" height={32} sx={{ mx: "auto", mb: 4, bgcolor: "rgba(255,255,255,0.15)" }} />
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.2)" }} />
          <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.2)" }} />
        </Box>
      </Box>
    </Box>
  );
}

/* Category Cards Skeleton */
export function CategorySkeleton({ count = 6 }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={4} sm={3} md={2} key={index}>
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Skeleton 
              variant="circular" 
              width={64} 
              height={64} 
              sx={{ mx: "auto", mb: 1 }} 
              animation="wave"
            />
            <Skeleton variant="text" width="80%" height={20} sx={{ mx: "auto" }} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

/* Cart Skeleton */
export function CartSkeleton() {
  return (
    <Box sx={{ px: { xs: 2, md: 8 }}}>
      <Skeleton variant="text" width={200} height={48} sx={{ mb: 3 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 4 }}>
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ borderRadius: "16px", p: 2 }}>
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 }, display: "flex", gap: 2, alignItems: "center" }}>
                <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: "20px" }} />
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Card sx={{ borderRadius: "16px", p: 3 }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2, mt: 3 }} />
        </Card>
      </Box>
    </Box>
  );
}

/* Bookings Skeleton */
export function BookingsSkeleton({ count = 4 }) {
  return (
    <Box sx={{ px: { xs: 2, md: 8 }, maxWidth: 900, mx: "auto" }}>
      <Skeleton variant="text" width={200} height={48} sx={{ mb: 1 }} />
      <Box sx={{ mb: 4 }} />
      <Stack spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} sx={{ borderRadius: "16px", p: 3 }}>
            <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Skeleton variant="text" width={200} height={28} />
                  <Skeleton variant="text" width={120} height={20} />
                </Box>
                <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: "16px" }} />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", gap: 3 }}>
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

/* Provider Dashboard Skeleton */
export function ProviderDashboardSkeleton() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ position: "fixed", left: 0, top: 0, width: 280, height: "100vh", background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <Box sx={{ p: "24px 20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: "12px", mb: 2 }} />
          <Skeleton variant="rectangular" width={150} height={44} sx={{ borderRadius: "8px" }} />
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Skeleton variant="text" width={60} height={16} sx={{ mb: 2, ml: 2 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={44} sx={{ borderRadius: "8px", mb: 1 }} />
          ))}
        </Box>
      </Box>
      <Box sx={{ flex: 1, ml: 280, p: 4 }}>
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>
          <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={200} height={24} sx={{ mb: 4 }} />
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ borderRadius: "16px" }}>
                  <Skeleton variant="rectangular" height={4} sx={{ borderRadius: "16px 16px 0 0" }} />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" width={40} height={40} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width={80} height={32} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Card sx={{ borderRadius: "16px", p: 3, mb: 4 }}>
            <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width={120} height={40} sx={{ borderRadius: "8px" }} />
              ))}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

/* Default Full Page Skeleton */
export function PageSkeleton() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#f8f9ff" }}>
      <Box sx={{ 
        background: "linear-gradient(180deg, #fff7f7 0%, #effcfa 60%, #ffffff 100%)",
        pb: 4,
        pt: 14,
        px: { xs: 2, md: 8 },
      }}>
        <Box sx={{ display: "flex", gap: 6, flexDirection: { xs: "column", md: "row" } }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={50} sx={{ mb: 4 }} />
            <Box sx={{ background: "#f5f5f5", borderRadius: "18px", p: 4 }}>
              <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={6} sm={4} key={item}>
                    <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "12px", mb: 1 }} animation="wave" />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} variant="rectangular" height={200} sx={{ borderRadius: "14px" }} animation="wave" />
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: "12px" }} animation="wave" />
      </Box>
      <Box sx={{ px: { xs: 2, md: 8 }, py: 4 }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} md={3} key={item}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: "12px" }} animation="wave" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

/* Error State Component */
export function ErrorState({ 
  message = "Something went wrong", 
  onRetry = null, 
  icon = "⚠️" 
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 4,
        textAlign: "center"
      }}
    >
      <Box sx={{ fontSize: 64, mb: 2 }}>{icon}</Box>
      <Box sx={{ fontSize: 20, fontWeight: 600, color: "text.primary", mb: 1 }}>
        Oops! Something went wrong
      </Box>
      <Box sx={{ fontSize: 14, color: "text.secondary", mb: 3, maxWidth: 400 }}>
        {message}
      </Box>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
          style={{ padding: "12px 24px", fontSize: 14 }}
        >
          🔄 Try Again
        </button>
      )}
    </Box>
  );
}

/* Loading Spinner Component */
export function LoadingSpinner({ size = 40, color = "primary" }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        border: `3px solid ${color === "primary" ? "#e5e7eb" : "transparent"}`,
        borderTopColor: color === "primary" ? "#2563eb" : color,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        "@keyframes spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      }}
    />
  );
}

/* Center Loading Component */
export function CenterLoader({ text = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        gap: 2
      }}
    >
      <LoadingSpinner />
      <Box sx={{ fontSize: 14, color: "text.secondary" }}>{text}</Box>
    </Box>
  );
}

export default PageSkeleton;
