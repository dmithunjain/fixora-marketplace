import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function ChangePassword(){

const user = JSON.parse(localStorage.getItem("user"));

const [password,setPassword]=useState("");

const update=()=>{

const updated={
...user,
password
};

localStorage.setItem("user",JSON.stringify(updated));

alert("Password updated");

};

return(
  <Box sx={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(180deg, #f8fafc 0%, #f3f6fb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2
  }}>
    <Box sx={{ 
      maxWidth: 450, 
      width: '100%',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
        p: 3,
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
          Change Password
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', mt: 0.5 }}>
          Set a new password for your account
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <TextField
          type="password"
          label="New Password"
          fullWidth
          sx={{ mb: 4 }}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          variant="outlined"
          placeholder="Enter new password"
        />

        <Button 
          variant="contained" 
          onClick={update}
          fullWidth
          sx={{ 
            py: 1.5,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' }
          }}
        >
          Update Password
        </Button>
      </Box>
    </Box>
  </Box>
);

}