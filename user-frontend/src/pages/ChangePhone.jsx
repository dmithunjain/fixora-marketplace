import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function ChangePhone(){

const user = JSON.parse(localStorage.getItem("user"));

const [phone,setPhone]=useState("");

const update=()=>{

const updated={
...user,
phone
};

localStorage.setItem("user",JSON.stringify(updated));

alert("Phone updated");

};

return(

<Box sx={{p:6,maxWidth:600,mx:"auto"}}>

<Typography variant="h5" sx={{mb:3}}>
Change Phone
</Typography>

<TextField
label="New Phone Number"
fullWidth
sx={{mb:3}}
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<Button variant="contained" onClick={update}>
Update Phone
</Button>

</Box>

);

}