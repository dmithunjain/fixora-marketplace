import React, { useState } from "react";
import {
Box,
Typography,
Paper,
Button,
Divider
} from "@mui/material";

import { useCart } from "../context/CartContext";

const services = [
{
id:1,
title:"Weekly bathroom cleaning subscription",
rating:4.71,
reviews:"487K",
price:215,
oldPrice:550,
duration:"30 mins",
image:"/assets/bathroom-cleaning.jpg"
},
{
id:2,
title:"Bathroom deep cleaning",
rating:4.8,
reviews:"4.9M",
price:399,
oldPrice:499,
duration:"60 mins",
image:"/assets/bathroom-cleaning2.jpg"
}
];

export default function ServicePage(){

const {cart,addToCart,totalPrice} = useCart();

return(

<Box sx={{px:8,py:6,background:"#fafafa",minHeight:"100vh"}}>

<Box
sx={{
display:"grid",
gridTemplateColumns:"1fr 2fr 1fr",
gap:4
}}
>

{/* LEFT PANEL */}

<Paper sx={{p:3,borderRadius:4}}>

<Typography fontWeight={700} mb={2}>
Select a service
</Typography>

<Button fullWidth variant="outlined" sx={{mb:2}}>
Weekly Plans
</Button>

<Button fullWidth variant="outlined" sx={{mb:2}}>
One Time Service
</Button>

<Button fullWidth variant="outlined">
Mini Services
</Button>

</Paper>

{/* CENTER SERVICES */}

<Box>

{services.map(service=>(

<Paper
key={service.id}
sx={{p:3,mb:3,borderRadius:4}}
>

<Box sx={{display:"flex",justifyContent:"space-between"}}>

<Box>

<Typography fontWeight={700}>
{service.title}
</Typography>

<Typography color="gray" fontSize={14}>
⭐ {service.rating} ({service.reviews} reviews)
</Typography>

<Typography mt={1}>
Starts at ₹{service.price}
</Typography>

<Typography fontSize={13} color="gray">
{service.duration}
</Typography>

</Box>

<Button
variant="outlined"
onClick={()=>addToCart(service)}
>
Add
</Button>

</Box>

</Paper>

))}

</Box>

{/* RIGHT CART */}

<Paper sx={{p:3,borderRadius:4,height:"fit-content",position:"sticky",top:120}}>

<Typography fontWeight={700} mb={2}>
Your Cart
</Typography>

{cart.length===0 && (
<Typography color="gray">
No items in your cart
</Typography>
)}

{cart.map((item,index)=>(
<Box key={index} mb={2}>
<Typography>{item.title}</Typography>
<Typography fontSize={14}>₹{item.price}</Typography>
<Divider sx={{mt:1}}/>
</Box>
))}

{cart.length>0 && (
<>
<Typography fontWeight={700} mt={2}>
Total: ₹{totalPrice}
</Typography>

<Button
variant="contained"
fullWidth
sx={{mt:2}}
href="/checkout"
>
Proceed to Payment
</Button>
</>
)}

</Paper>

</Box>

</Box>

);
}