import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import {
  Typography,
  InputLabel,
  FormControl,
  Link,
  TextField,
  Box,
} from '@mui/material';
import './optionalParameter.scss'; // Import the CSS file

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
    if (e.target.value <= 200) {
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
      <Box className="optional-parameter-container">
        <Typography className="bold-heading">Optional parameter</Typography>
        <Typography className="parameter-heading">Where</Typography>
        <Typography className="parameter-description">
          To filter record based on certain
        </Typography>
        <TextField
          id="outlined-basic"
          value={text}
          label=""
          onChange={handleTextChange}
          variant="outlined"
          className="text-field"
        />
        <br />
        <br />
        <br />
        <Link href="#" className="link">
          Learn more about the where clause
        </Link>
        <Typography className="limit-heading">Limit</Typography>
        <Typography className="limit-text">
          Limit Column/Field in response
        </Typography>
        <div>
          <FormControl sx={{ m: 1, minWidth: 40 }}>
            <InputLabel
              id="demo-simple-select-helper-label"
              className="limit-description"
            >
              
            </InputLabel>
            <TextField
              id="demo-simple-select-helper"
              value={props?.age}
              label="Limit"
              onChange={handleChange}
              className="text-field"
              type="number"
              inputProps={{ pattern: "[0-9]*" }}
              placeholder="none"
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
