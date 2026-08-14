import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function ChangeEmail(){

const user = JSON.parse(localStorage.getItem("user"));

const [email,setEmail]=useState("");

const update=()=>{

const updated={
...user,
email
};

localStorage.setItem("user",JSON.stringify(updated));

alert("Email updated");

};

return(

<Box sx={{p:6,maxWidth:600,mx:"auto"}}>

<Typography variant="h5" sx={{mb:3}}>
Change Email
</Typography>

<TextField
label="New Email"
fullWidth
sx={{mb:3}}
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<Button variant="contained" onClick={update}>
Update Email
</Button>

</Box>

);

}