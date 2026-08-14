import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box } from "@mui/material";

import banner1 from "../assets/man-doing-professional-home-cleaning-service_23-2150359014.jpg";
import banner2 from "../assets/make-up-artist-getting-model-ready-photoshootin (1).jpg";
import banner3 from "../assets/man-barbershop-salon-doing-haircut-beard-trim.jpg";

export default function BannerCarousel() {

const banners = [banner1, banner2, banner3];

return (

<Box
sx={{
py:3,
px:{xs:2,md:8},
background:
"linear-gradient(180deg,#f8fafc 0%,#eef2ff 50%,#f8fafc 100%)"
}}
>

<Box
sx={{
maxWidth:"1200px",
margin:"auto"
}}
>

<Carousel
indicators
controls
interval={3000}
pause={false}
fade
ride="carousel"
wrap
>

{banners.map((img,index)=>(
<Carousel.Item key={index}>

<Box
component="img"
src={img}
alt={`banner-${index}`}
sx={{
width:"100%",
height:{xs:280, md:450},
objectFit:"cover",
borderRadius:"24px",
boxShadow:"0 20px 45px rgba(0,0,0,0.12)"
}}
/>

</Carousel.Item>
))}

</Carousel>

</Box>

</Box>

);

}