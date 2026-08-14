import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const categories = [
{ name:"Home Cleaning", icon:"🧹", bookings:"2M+ bookings", slug:"cleaning" },
{ name:"AC Repair", icon:"❄️", bookings:"1.5M+ bookings", slug:"appliance" },
{ name:"Salon for Women", icon:"💅", bookings:"3M+ bookings", slug:"salon" },
{ name:"Salon for Men", icon:"✂️", bookings:"800K+ bookings", slug:"salon" },
{ name:"Electrician", icon:"⚡", bookings:"900K+ bookings", slug:"electrical" }
];

export default function CategorySection(){

const navigate = useNavigate();

return(

<Box sx={{px:{xs:2,md:8},py:6}}>

<Box sx={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
mb:4
}}>

<Box>

<Typography
variant="h4"
sx={{fontWeight:700,fontFamily:"Georgia"}}
>
What are you looking for?
</Typography>

<Typography sx={{color:"gray"}}>
Professional services for every need at home
</Typography>

</Box>

<Typography sx={{
color:"#f59e0b",
fontWeight:600,
cursor:"pointer"
}}>
See all →
</Typography>

</Box>


<Box
sx={{
display:"grid",
gridTemplateColumns:{
xs:"repeat(2,1fr)",
sm:"repeat(3,1fr)",
md:"repeat(4,1fr)"
},
gap:3
}}
>

{categories.map((cat,index)=>(
<Box
key={index}
onClick={()=>navigate(`/category/${cat.slug}`)}
sx={{

background:"#f7f7f7",
borderRadius:"18px",
p:3,
textAlign:"center",
cursor:"pointer",
transition:"0.25s",

"&:hover":{
transform:"translateY(-4px)",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}

}}
>

<Typography sx={{fontSize:30,mb:1}}>
{cat.icon}
</Typography>

<Typography sx={{fontWeight:600,fontSize:14}}>
{cat.name}
</Typography>

<Typography sx={{fontSize:12,color:"gray"}}>
{cat.bookings}
</Typography>

</Box>
))}

</Box>

</Box>

);

}