import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ServiceCard from "../components/ServiceCard";
import { publicServiceAPI } from "../services/api";

const categorySlugMap = {
  'ac': 'ac-repair',
  'ac-repair': 'ac-repair',
  'cleaning': 'home-cleaning',
  'home-cleaning': 'home-cleaning',
  'appliance': 'appliance-repair',
  'appliance-repair': 'appliance-repair',
  'electrical': 'electrical',
  'salon': 'salon-spa',
  'salon-spa': 'salon-spa',
  'salon-women': 'salon-spa',
  'massage-men': 'salon-spa',
  'beauty': 'salon-spa',
  'painting': 'painting',
  'wall': 'painting',
  'plumbing': 'plumbing',
  'water': 'plumbing',
  'tile': 'plumbing',
  'pest-control': 'pest-control',
  'carpenter': 'carpenter',
  'carpentring': 'carpenter',
  'carpentry': 'carpenter',
  'gardening': 'gardening',
  'garden': 'gardening',
};

export default function CategoryPage() {

const { slug } = useParams();
const [categoryServices, setCategoryServices] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadServices = async () => {
    setLoading(true);
    try {
      const normalizedSlug = categorySlugMap[slug] || slug;
      const response = await publicServiceAPI.getServices({ category: normalizedSlug });
      const backendServices = response?.data?.services || [];
      
      const mapped = backendServices.map(s => ({
        id: s._id,
        name: s.title,
        title: s.title,
        description: s.description,
        price: s.price,
        category: s.category,
        image: s.images?.[0] || s.image,
        rating: s.rating || 0,
        provider: s.provider
      }));
      
      setCategoryServices(mapped);
    } catch (err) {
      console.log("Backend services fetch failed:", err.message);
      setCategoryServices([]);
    } finally {
      setLoading(false);
    }
  };

  loadServices();
}, [slug]);

/* Filter services by category */
const filteredServices = categoryServices;

return (

<Box
sx={{
pt: { xs: 12, md: 14 },
px: { xs: 2, md: 6 },
pb: 8,
background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
minHeight: "100vh"
}}
>

{/* PAGE HEADER */}
<Box sx={{ 
  mb: 5,
  pb: 3,
  borderBottom: '1px solid #e2e8f0'
}}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
      fontSize: { xs: '24px', md: '32px' },
      color: '#1e293b',
      mb: 1,
      letterSpacing: '-0.5px'
    }}
  >
    {slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
  </Typography>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
    <Typography sx={{ color: '#64748b', fontSize: '15px' }}>
      {filteredServices.length} services available
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      px: 2,
      py: 0.5,
      background: '#e0e7ff',
      borderRadius: '20px'
    }}>
      <Box sx={{ 
        width: 8, 
        height: 8, 
        borderRadius: '50%', 
        background: '#4f46e5' 
      }} />
      <Typography sx={{ color: '#4f46e5', fontSize: '12px', fontWeight: 600 }}>
        Verified Providers
      </Typography>
    </Box>
  </Box>
</Box>

{/* CATEGORY ICONS ROW */}
<Box sx={{ 
  display: 'flex', 
  gap: 2, 
  mb: 4,
  overflowX: 'auto',
  pb: 1,
  '&::-webkit-scrollbar': { display: 'none' }
}}>
  {['All', 'Near You', 'Top Rated', 'Popular', 'New'].map((filter, idx) => (
    <Box
      key={filter}
      sx={{
        px: 3,
        py: 1,
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        background: idx === 0 ? '#4f46e5' : '#fff',
        color: idx === 0 ? '#fff' : '#64748b',
        border: '1px solid',
        borderColor: idx === 0 ? '#4f46e5' : '#e2e8f0',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: idx === 0 ? '#4338ca' : '#f8fafc',
          borderColor: '#4f46e5'
        }
      }}
    >
      {filter}
    </Box>
  ))}
</Box>

{/* SERVICES GRID */}

<Box
sx={{
display: "grid",
gridTemplateColumns: {
xs: "repeat(1,1fr)",
sm: "repeat(2,1fr)",
md: "repeat(3,1fr)",
lg: "repeat(4,1fr)"
},
gap: 3
}}
>

{filteredServices.map((service) => (

<ServiceCard
key={service.id}
service={service}
/>

))}

</Box>

{/* EMPTY STATE */}
{filteredServices.length === 0 && (
  <Box sx={{ 
    textAlign: 'center', 
    py: 8,
    px: 2
  }}>
    <Typography sx={{ 
      fontSize: '18px', 
      color: '#64748b',
      mb: 1
    }}>
      No services found in this category
    </Typography>
    <Typography sx={{ 
      fontSize: '14px', 
      color: '#94a3b8'
    }}>
      We're working on adding more services soon
    </Typography>
  </Box>
)}

</Box>

);

}
