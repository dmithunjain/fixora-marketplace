import { createTheme } from '@mui/material/styles';


const theme = createTheme({
palette: {
primary: { main: '#7b61ff' }, // lavender purple
secondary: { main: '#f4f1ff' },
background: {
default: '#d1ccdc'
}
},
shape: { borderRadius: 14 },
typography: {
fontFamily: 'Inter, Roboto, sans-serif'
}
});


export default theme;