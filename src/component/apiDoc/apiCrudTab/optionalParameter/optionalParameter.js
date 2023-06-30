import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Typography,
  InputLabel,
  FormControl,
  Link,
  TextField,
  Checkbox,
  Box,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import './optionalParameter.scss'; // Import the CSS file
import { makeStyles } from '@mui/styles';

import CustomAutoSuggest from '../../../customAutoSuggest/customAutoSuggest';
import variables from '../../../../assets/styling.scss';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
};


function OptionalParameter(props) {
  const [fields, setFields] = useState([]);
  const [html, setHtml] = useState('');
  const [text, setText] = useState('');
  const [fieldtosort, setFieldtosort] = useState('');
  const [offset, setOffset] = useState('');
  const [descending, setDescending] = useState('asc');
  const [selectedFields, setSelectedFields] = useState(['all']);

  
const useStyles = makeStyles(() => ({
  formControl: {
  

    '& .MuiInputLabel-root': {
      color: `${variables.basictextcolor}`, // Change the label color here
    },
    '& .MuiSelect-icon': {
      color: `${variables.basictextcolor}`, // Change the icon color here
    },
    '& .MuiSelect-root': {
      borderColor: `${variables.basictextcolor}`, // Change the border color here
      borderRadius: 0,
      height: '36px',
      color: `${variables.basictextcolor}`,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black', // Change the border color here
      },
    },

  },
  selectEmpty: {
    marginTop: 2,
  },
}));

const classes = useStyles();
  useEffect(() => {
    props?.parent!='delete' && tableData();
  }, [props.db, props.table]);

  useEffect(() => {
    let queryParams = '';

    if (text && props?.parent=='updaterecord') {
      queryParams += `${text.trim()}`;
    }
    else if(text)
    {      queryParams += `filter=${text.trim()}`;
  }
    if (!selectedFields.includes('all')) {
      queryParams += `${queryParams ? '&' : ''}fields=${selectedFields.join(',')}`;
    }
    if (fieldtosort) {
      queryParams += `${queryParams ? '&' : ''}sort=${fieldtosort}='${descending}'`;
    }

    if (props?.age) {
      queryParams += `${queryParams ? '&' : ''}limit=${props.age}`;
    }
    if (offset) {
      queryParams += `${queryParams ? '&' : ''}offset=${offset}`;
    }

    props?.setValue(queryParams);
  }, [text, fieldtosort, descending, props.age, offset, selectedFields]);

  const tableData = async () => {
    const myObj =props?.alltabledata[props?.table]?.fields ;
    const arr = Object.keys(myObj).map((key) => ({
      name: myObj[key].fieldName,
      content: key,
    }));
    setFields(arr);
  };

  const handleSortChange = (e) => {
    setFieldtosort(e.target.value);
  };

  const handleTextChange = (text, html) => {
    setText(text.trim());
    setHtml(html);
    setText(text);
  };

  const handleChange = (e) => {
    const selectedAge = e.target.value;
    if (e.target.value <= 2000) {
      props?.setAge(selectedAge.trim());
    }
  };

  const handleChangeOffset = (e) => {
    const off = e.target.value;
    if (e.target.value <= 2000) {
      setOffset(off.trim());
    }
  };

  const handleSelectFields = (event) => {
    const { value } = event.target;
    if (value.includes('select_all')) {
      setSelectedFields(['all']);
    } else {
      const selectedItems = value.filter((item) => item !== 'select_all' && item !== 'all');
      setSelectedFields(selectedItems);
    }
  };

  return (
    <div>
      <Box component="div" className="optional-parameter-container">
      { props?.parent=='listrecord' && <Typography fontWeight={variables.titleweight} fontSize={Number(variables.titlesize)} variant={variables.titlevariant}>
       Optional parameters
        </Typography>}
        <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} variant={variables.titlevariant} style={{ paddingTop: '10px' }}>
          Where
        </Typography>
        <Typography style={{ paddingBottom: '4px' }}>Write condition to filter records.</Typography>
        <div style={{marginLeft:'1%'}}>
        <CustomAutoSuggest
          getInputValueWithContext={handleTextChange}
          width="70%"
          suggestion={fields}
          setHtml={setHtml}
          setText={setText}
          defaultValue={html}
        />
        </div>

        <Link href="#" style={{ fontSize: `${variables.linksizeoptionalparameter}px` }}>
          Learn more about the where clause
        </Link>
        {props?.parent=='listrecord' && (
          <Box>
            <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} style={{ paddingTop: '8px' }}>
              Fields to show
            </Typography>
            <Typography>Select the columns you want.</Typography>

            <FormControl  className={` ${classes.formControl}`} sx={{ m: 1, mt: 0, minWidth: 200 }}>
              <Select
                labelId="mutiple-select-label"
                multiple
                value={selectedFields}
                MenuProps={MenuProps}
                style={{ height: '50px', width: 200, borderRadius: 0,color:`${variables.basictextcolor}` }}
                onChange={handleSelectFields}
                renderValue={(selected) =>
                  selected.includes('all') ? 'All Fields' : selected.join(', ')
                }
              >
                <MenuItem value="select_all" sx={{ borderBottom: '1px solid lightblue' ,color:`${variables.basictextcolor}`}}>
                  <ListItemText>All Fields</ListItemText>
                  <ListItemIcon>
                    <Checkbox checked={selectedFields.includes('all')} />
                  </ListItemIcon>
                </MenuItem>
                {fields.map((field) => (
                  <MenuItem key={field.content} value={field.content} sx={{color:`${variables.basictextcolor}`}}>
                    <ListItemText>{field.name}</ListItemText>
                    <ListItemIcon>
                      <Checkbox checked={selectedFields.includes(field.content)} />
                    </ListItemIcon>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} style={{ paddingTop: '8px' }}>
              Sort
            </Typography>
            <Typography>Select the column and its order to sort the data.</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl className={` ${classes.formControl}`} sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-helper-label">Sort by</InputLabel>
                <Select
                  id="demo-simple-select-helper"
                  value={fieldtosort}
                  label="sort by col"
                  onChange={handleSortChange}
                  style={{ height: '50px', width: '100%', borderRadius: 0,color:`${variables.basictextcolor}` }}
                  MenuProps={MenuProps}
                >
                  <MenuItem key={1} value="" sx={{color:`${variables.basictextcolor}`}}>
                    --none--
                  </MenuItem>
                  {fields.map((field) => (
                    <MenuItem key={field.content} value={field.content} sx={{color:`${variables.basictextcolor}`}}>
                      {field.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {fieldtosort !== '' && (
                <FormControl sx={{ m: 1 }} className={` ${classes.formControl}`} >
                  <Select
                    value={descending}
                    onChange={(e) => setDescending(e.target.value)}
                    style={{ height: '50px', width: '100px', borderRadius: 0,color:`${variables.basictextcolor}` }}
                  >
                    <MenuItem sx={{color:`${variables.basictextcolor}`}}value="asc">Asc</MenuItem>
                    <MenuItem sx={{color:`${variables.basictextcolor}`}} value="desc">Desc</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} style={{ paddingTop: '10px' }}>
              Limit
            </Typography>

            <Typography>Limit number of records in response.</Typography>
            <Box>
              <FormControl className={` ${classes.formControl}`} sx={{ m: 1, minWidth: 200 }}>
                <TextField
                  id="demo-simple-select-helper"
                  value={props?.age}
                  label="Limit"
                  onChange={handleChange}
                  style={{ height: '50px', width: '100px',color:`${variables.basictextcolor}` }}
                  type="number"
                  inputProps={{ pattern: '[0-9]*' }}
                  placeholder="none"
                />
              </FormControl>
            </Box>

            <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} style={{ paddingTop: '10px' }}>
              Offset
            </Typography>

            <Typography>Enter number of records to skip.</Typography>

            <FormControl className={` ${classes.formControl}`} sx={{ m: 1, minWidth: 200 }}>
              <TextField
                id="demo-simple-select-helper"
                value={offset}
                label="Offset"
                onChange={handleChangeOffset}
                style={{ height: '50px', width: '100px',color:`${variables.basictextcolor}` }}
                type="number"
                inputProps={{ pattern: '[0-9]*' }}
                placeholder="none"
              />
            </FormControl>
          </Box>
        )}
      </Box>
    </div>
  );
}

OptionalParameter.propTypes = {
  age: PropTypes.any,
  setAge: PropTypes.func,
  value: PropTypes.any,
  parent: PropTypes.any,
  setValue: PropTypes.func,
  db: PropTypes.any,
  table: PropTypes.any,
  alltabledata:PropTypes.any,
};

export default OptionalParameter;
