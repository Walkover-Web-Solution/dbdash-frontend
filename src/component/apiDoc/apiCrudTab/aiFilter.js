import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import variables from '../../../assets/styling.scss';


const AiFilter = () => {
  const aiFilterStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    width: '600px' // Adjust the width as desired
  };

  const headerStyle = {
    backgroundColor: '#e6e6e6',
    padding: '10px',
    fontWeight: 'bold',
  };

  const contentStyle = {
    marginTop: '10px'
  };

  const inputStyle = {
    width: '99.3%',
    padding: '5px',
    marginBottom: '10px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'flex-start', // Adjust alignment as needed
    justifyContent: 'flex-start' // Adjust alignment as needed
  };

  return (
    <div style={aiFilterStyle}>
      <div style={headerStyle}>Filter</div>
      <div style={contentStyle}>
        <div style={buttonContainerStyle}>
          <TextField
            type="text"
            sx={inputStyle}
            placeholder="Example: Column 1 contains USA"
            variant="outlined"
          />
          <Button
            variant="outlined"
            className='mui-button-outlined'
            sx={{
              fontSize: `${variables.editfilterbutttonsfontsize}`,
              marginTop: '6px', // Adjust the margin top as needed
              marginLeft: '-5px' // Adjust the margin left as needed
            }}
            style={{ width: '250px', padding: '15px' }}
          >
            Generate Query by AI
          </Button>
        </div>
        <TextField
          sx={inputStyle}
          placeholder="Query result..."
          variant="outlined"
          multiline
          rows={6}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button className="mui-button" variant="contained">
            Use
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default AiFilter;
