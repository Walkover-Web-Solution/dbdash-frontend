import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  // MenuItem,
  Typography,
  // Select,
  InputLabel,
  FormControl,
  Link,
  TextField,
  Box,
} from '@mui/material';

function OptionalParameter(props) {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value.trim());

    if (e.target.value.trim() !== '' && props.age !== '') {
      props.setValue(e.target.value + `&pageSize=${props.age}`);
    } else if (e.target.value.trim() !== '') {
      props.setValue(e.target.value);
    } else if (e.target.value.trim() === '' && props.age !== '') {
      props.setValue(`pageSize=${props.age}`);
    } else if (e.target.value.trim() === '') {
      props.setValue('');
    }
  };

  const handleChange = (e) => {
    const selectedAge = e.target.value;
  if(e.target.value<=200)
  {
    if (selectedAge.trim() !== '') {
      props?.setAge(selectedAge);
      if (text.trim() !== '') {
        props.setValue(text + `&pageSize=${selectedAge}`);
      } else {
        props.setValue(`pageSize=${selectedAge}`);
      }
    } else {
      props?.setAge('');
      props.setValue('');
    }
  }
  };
  

  return (
    <div>
      <Box
        component="div"
        style={{
          border: '2px solid black',
          borderRadius: '1px',
          padding: '10px',
          width: '34.5vw',
          backgroundColor: 'lightgrey',
        }}
      >
        <Typography style={{ fontWeight: 'bold', fontSize: '17px' }}>Optional parameter</Typography>
        <Typography style={{ fontWeight: 'bold', fontSize: '17px', paddingTop: '10px' }}>Where</Typography>
        <Typography style={{ paddingBottom: '15px' }}>To filter record based on certain</Typography>
        <TextField
          id="outlined-basic"
          value={text}
          label=""
          onChange={handleTextChange}
          variant="outlined"
          style={{ height: '0px', width: 450 }}
        />
        <br />
        <br />
        <br />
        <Link href="#" style={{ fontSize: '15px' }}>
          Learn more about the where clause
        </Link>
        <Typography style={{ fontWeight: 'bold', fontSize: '17px', paddingBottom: '8px', paddingTop: '13px' }}>
          Limit
        </Typography>

        
        <Typography>Limit Column/Field in response</Typography>
        <div>
        <FormControl sx={{ m: 1, minWidth: 60 }}>
  <InputLabel id="demo-simple-select-helper-label" style={{ fontSize: '15px', paddingBottom: '40px' }}>
    
  </InputLabel>
  <TextField
  id="demo-simple-select-helper"
  value={props?.age}
  label="Limit"
  onChange={handleChange}
  style={{ height: '50px' }}
  type="number"
  inputProps={{ pattern: "[0-9]*" }}
  placeholder='none'
/>

</FormControl>


        </div>
      </Box>
    </div>
  );
}

OptionalParameter.propTypes = {
  age: PropTypes.number,
  setAge: PropTypes.func,
  value: PropTypes.any,
  setValue: PropTypes.func,
};

export default OptionalParameter;
