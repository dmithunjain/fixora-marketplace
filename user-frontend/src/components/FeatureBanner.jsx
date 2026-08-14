import { Box, Typography, Button } from "@mui/material";

export default function FeatureBanner() {
  return (
    <Box sx={{ px: { xs: 2, md: 8 }, py: 6 }}>
      <Box
        sx={{
          background: "#F7EFE6",
          borderRadius: "24px",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 5 }}>
          <Typography variant="h4" fontWeight={700}>
            Wall Panels
          </Typography>
          <Typography mb={3}>Level up your walls</Typography>
          <Button variant="contained">Know more</Button>
        </Box>

        <img
          src="/wall-panel.jpg"
          alt="Wall panels"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
}
