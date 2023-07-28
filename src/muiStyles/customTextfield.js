import React from 'react';
import TextField from '@mui/material/TextField';

const CustomTextField = (props) => {
  return (
    <TextField
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 0, // Set border radius to 0 to make it rigid
          // Customize the border color and width
        },
      
      }}
      {...props}
    />
  );
};

export default CustomTextField;
