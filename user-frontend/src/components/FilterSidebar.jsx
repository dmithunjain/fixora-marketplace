import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel
} from "@mui/material";

export default function FilterSidebar({
  categories,
  selected,
  setSelected
}) {
  const toggle = (cat) => {
    if (selected.includes(cat)) {
      setSelected(selected.filter((c) => c !== cat));
    } else {
      setSelected([...selected, cat]);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Categories
      </Typography>

      {categories.map((cat) => (
        <FormControlLabel
          key={cat}
          control={
            <Checkbox
              checked={selected.includes(cat)}
              onChange={() => toggle(cat)}
            />
          }
          label={cat}
        />
      ))}
    </Box>
  );
}