import { Box, Typography, Card, CardContent } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DashboardCards = () => {
  const cards = [
    {
      icon: CloudUploadIcon,
      title: "Upload Catalog",
      description: "Add your products to start selling on the platform",
      buttonText: "Upload Now",
      color: "#3b82f6"
    },
    {
      icon: WorkIcon,
      title: "Add Business Type",
      description: "Select your business category to optimize your presence",
      buttonText: "Configure",
      color: "#22c55e"
    },
    {
      icon: CheckCircleIcon,
      title: "Complete Account Setup",
      description: "Finish your profile setup to unlock all features",
      buttonText: "Complete Setup",
      color: "#8b5cf6"
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }, 
      gap: 3, 
      mb: 4 
    }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card 
            key={idx} 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: card.color,
                mb: 2
              }}>
                <Icon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {card.description}
              </Typography>
              <Box 
                component="button"
                sx={{ 
                  width: '100%', 
                  py: 1.5, 
                  bgcolor: card.color, 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 }
                }}
              >
                {card.buttonText}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default DashboardCards;
