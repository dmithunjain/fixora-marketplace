import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess(){

const navigate = useNavigate();

return(

<Box
sx={{
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
minHeight:"70vh",
textAlign:"center"
}}
>

<CheckCircleIcon
sx={{
fontSize:80,
color:"green",
mb:2
}}
/>

<Typography
variant="h4"
fontWeight="700"
mb={2}
>
Payment Successful
</Typography>

<Typography color="gray" mb={3}>
Your service booking has been confirmed.
</Typography>

<Button
variant="contained"
onClick={()=>navigate("/")}
>
Back to Home
</Button>

</Box>

);
}