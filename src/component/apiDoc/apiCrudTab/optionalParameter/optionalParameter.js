import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import {
  Typography,
  InputLabel,
  FormControl,
  // Link,
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

// import CustomAutoSuggest from '../../../customAutoSuggest/customAutoSuggest';
import variables from '../../../../assets/styling.scss';
import FilterConditionTable from './filterConditionTable';
import AiFilter from './Aifilter';



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
  // const [
  //   // html
  //   , setHtml] = useState('');
  const [text, 
    // setText
  
  ] = useState('');
  const [fieldtosort, setFieldtosort] = useState('');
  const [offset, setOffset] = useState('');
  const [descending, setDescending] = useState('asc');
  const [selectedFields, setSelectedFields] = useState(['all']);
  const [selectedRows, setSelectedRows] = useState("");
const[querymade,setQuerymade]=useState('');
  const handleUse=()=>{
    props?.setValue(querymade);
  }
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
  if(selectedRows.length>0 && props?.parent=='updaterecord')
  {

  queryParams += `${queryParams ? ' AND ' : ''}${selectedRows}`;
  }
  else if(selectedRows.length>0)
  {
   
      queryParams += `${queryParams ? '&' : ''}filter=${selectedRows}`;

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

    setQuerymade(queryParams);
  }, [text, fieldtosort, descending, props.age, offset, selectedFields,selectedRows]);

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

  // const handleTextChange = (text, html) => {
  //   setText(text.trim());
  //   setHtml(html);
  //   setText(text);
  // };

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
  const changeQueryMade=(event)=>{
    setQuerymade(event.target.value);
  }

  return (
    <div>
      <Box component="div" className="optional-parameter-container">
      { props?.parent=='listrecord' &&         <Typography variant={variables.megatitlevariant} fontSize={Number(variables.megatitlesize)} >

       Optional parameters
        </Typography>}
        <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} variant={variables.titlevariant} style={{ paddingTop: '20px' }}>
          Where
        </Typography>
        <Typography style={{ paddingBottom: '4px' }}>{`"filter" conditions in the APIs enable you to retrieve specific records that meet specific criteria. By applying "filter" conditions, you can refine the results based on specific field values or patterns.
To implement a filter condition in the APIs, you can include the "filter" parameter in your API request. The "filter" parameter accepts formula expressions that can include various operators and functions, allowing you to create complex filter conditions. You can utilize logical operators such as "AND," "OR," and "NOT" to combine multiple conditions. Additionally, comparison operators like "=", ">", "<," and functions like "FIND()," "LEN()," and "IS_BEFORE()" can be used to specify precise criteria for filtering.`}</Typography>
      
      <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} variant={variables.titlevariant} style={{ paddingTop: '20px' }}>
      Examples for where conditions:
        </Typography>
<div style={{display:'flex',justifyContent:'center'}}>

        <div style={{ width: '50vw', height: '15vh', backgroundColor: '#F0F0F0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography sx={{ justifyContent:'center',width:'100%',pl:2}}>
  GET `https://dbdash-backend-h7duexlbuq-el.a.run.app/<span style={{color: "#028a0f"}}>Your_DataBase_ID</span>/<span style={{color: "#028a0f"}}>Your_Table_ID</span>? <span style={{color: "#028a0f"}}>filter=FieldID1 != `John`</span>`</Typography>
</div>
</div>
<Typography sx={{pt:'20px'}} >
Select the column name and click on the CheckBox to generate API on the right side.
</Typography>
<div style={{display:'flex',justifyContent:'center'}}>
<FilterConditionTable selectedRows={selectedRows} setSelectedRows={setSelectedRows} alltabledata={props?.alltabledata} table={props?.table} db={props?.db}/>
</div>
<Typography sx={{pt:'20px'}} >
Still need help? Ask AI to generate your Filter condition
            </Typography>
<div style={{display:'flex',justifyContent:'center'}}>

            <AiFilter handleUse={handleUse} changeQueryMade={changeQueryMade} querymade={querymade} setQuerymade={setQuerymade} tableName={props?.table}/>
     </div>
        {/* <div style={{marginLeft:'1%'}}>
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
        </Link> */}
        {props?.parent=='listrecord' && (
          <Box>
            <Typography fontWeight={variables.titleweight} fontSize={Number(variables.textsize)} style={{ paddingTop: '8px' }}>
              Fields to show
            </Typography>
            <Typography>
           {` The "Fields to show" parameter in the List Record API enables you to precisely define which fields you wish to receive in the response.
To utilize the "Fields to show" parameter, simply include it as a query parameter in your API request. Specify the desired field names or field IDs as a comma-separated list. The API response will only contain the specified fields, excluding all others.
Here's an example of utilizing the "Fields to show" parameter in the API.`}

            </Typography>
<div style={{display:'flex',justifyContent:'center'}}>

            <div style={{ width: '50vw', height: '15vh', backgroundColor: '#F0F0F0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Typography sx={{ justifyContent:'center',width:'100%',pl:2}}>
  GET `https://dbdash-backend-h7duexlbuq-el.a.run.app/<span style={{color: "#028a0f"}}>Your_DataBase_ID</span>/<span style={{color: "#028a0f"}}>Your_Table_ID</span>? <span style={{color: "#028a0f"}}>fields=field1,field2,field3</span>`
  <br/>
  <span  style={{color: variables.deletecolor}}>-H </span>&apos; <span  style={{color: variables.deletecolor}}>auth-key: AUTH_TOKEN</span>&apos;

  </Typography>
</div>

</div>
            <FormControl  className={` ${classes.formControl}`} sx={{ m: 1,  minWidth: 200 }}>
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
              Sort by, Limit and Offset
            </Typography>
            <Typography>{`The API provides a list of sort objects to define the order in which records will be arranged. Each sort object should include a field key that indicates the field name for sorting. Additionally, you can optionally include a direction key with a value of either "asc" (ascending) or "desc" (descending) to specify the sorting direction. By default, the sorting direction is set to "asc".

By default, the limit of records is set to 100. If there are additional records beyond this limit, the response will include an OFFSET value. To retrieve the next page of records, include the offset value as a parameter in your subsequent request. The pagination process will continue until you have reached the end of your table.`}</Typography>

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
                <FormControl sx={{ m: 1,mt:2 }} className={` ${classes.formControl}`} >
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

           

            <Box>
              <FormControl className={` ${classes.formControl}`} sx={{ m: 1,mt:0, minWidth: 200 }}>
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
