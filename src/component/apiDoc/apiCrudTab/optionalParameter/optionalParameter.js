import React, { useState,useEffect } from 'react';
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
import CustomAutoSuggest from '../../../customAutoSuggest/customAutoSuggest';
import { getAllfields } from "../../../../api/fieldApi";
import variables from '../../../../assets/styling.scss';
function OptionalParameter(props) {
  const [fields, setFields] = useState([]);
  const [html, setHtml] = useState('')
  const [text, setText] = useState('');

  useEffect(() => {
    tableData();
  }, [])
  const tableData = async () => {
    const data = await getAllfields(props.db, props.table);
    let myObj = data.data.data.fields;
    let arr = [];
    Object.keys(myObj).map((key) => {
      arr.push({ name: myObj[key].fieldName, content: key });
    })
    setFields(arr);
  };

  const handleTextChange = (text,html) => {
    setText(text.trim());
    setHtml(html);
    setText(text);
    if (text.trim() !== '' && props.age !== '') {
      props.setValue(text + `&pageSize=${props.age}`);
    } else if (text.trim() !== '') {
      props.setValue(text);
    } else if (text.trim() === '' && props.age !== '') {
      props.setValue(`pageSize=${props.age}`);
    } else if (text.trim() === '') {
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
      <Box
        component="div"
       className='optional-parameter-container'
      >
        <Typography fontWeight={variables.titleweight} fontSize={Number(variables.titlesize)} variant={variables.titlevariant}>Optional parameter</Typography>
        <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} variant={variables.titlevariant}style={{ paddingTop: '10px' }}>Where</Typography>
        <Typography style={{ paddingBottom: '15px' }}>To filter record based on certain</Typography>
        <CustomAutoSuggest getInputValueWithContext={handleTextChange} suggestion={fields} setHtml={setHtml} setText={setText} defaultValue={html} />
        <br />
        <br />
        <br />
        <Link href="#" style={{ fontSize: `${variables.textsize}px` }}>
          Learn more about the where clause
        </Link>
        <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} style={{ paddingBottom: '8px', paddingTop: '1px' }}>
          Limit
        </Typography>

        <Typography>Limit Column/Field in response</Typography>
        <div>
          <FormControl sx={{ m: 1, minWidth: 60 }}>
            <InputLabel id="demo-simple-select-helper-label"  style={{ fontSize: `${variables.textsize}px`, paddingBottom: '40px' }}>
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
  db: PropTypes.func,
  table: PropTypes.any,
};

export default OptionalParameter;
