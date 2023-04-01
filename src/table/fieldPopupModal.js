import React,{useState} from 'react';
import PropTypes from 'prop-types';
import { getAllTableInfo } from '../store/allTable/allTableSelector';
import {useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { Box } from '@mui/system';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function FieldPopupModal(props)  {
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [lookupField,setLookupField] = useState(false)
  const [openn,setOpenn] = useState(false);
  const [userQuery,setUserQuery] = useState(false);
  const [showNumericOptions, setShowNumericOptions] = useState(false);
  const [showDecimalOptions , setShowDecimalOptions] = useState(false);
 
 
  const handleSwitchChange = (event) => {
    var data =  props?.metaData;
    data.unique = event.target.checked
    props?.setMetaData(data);
  };


  const handleTextChange = (event) => {
    props?.setTextValue(event.target.value);
  };

  // const handleSelectChange = (event) => {
   
  // };

  const selectDecimalValue = (event) => {
    const data= props?.metaData;
    data.decimal = event.target.value
    props?.setDecimalSelectValue(data)
    props?.setDecimalSelectValue(event.target.value)
    console.log("first",event.target.value)
  }

  const handleSelectChange = (event) => {
    props?.setSelectValue(event.target.value);

    if(event.target.value== "lookup")
    {
      setLookupField(true)
      props?.setSelectValue(event.target.value);
    }
    else
    {
      setLookupField(false)
      props?.setSelectValue(event.target.value);
    }
    if(event.target.value == "generatedcolumn")
    {
      setOpenn(true)
      props?.setSelectValue(event.target.value);
    }else
    {
      props?.setSelectValue(event.target.value);
      setOpenn(false)
    }

    if (event.target.value === 'numeric') {
      setShowNumericOptions(true);
      setShowDecimalOptions(false);
    } else if (event.target.value === 'decimal' && showNumericOptions) {
      props?.setSelectValue('numeric')
      setShowNumericOptions(true);
      setShowDecimalOptions(true);
    } else {
      setShowNumericOptions(false);
      setShowDecimalOptions(false);
    }
  };
  const handleClose = () => {
    props?.setOpen(false);
    setOpenn(false);
    props?.setSelectValue("Text");
  };

  // const isInputEmpty = props?.textValue.trim() === '';

  return (
    <div>

      <Dialog
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <DialogTitle id="form-dialog-title">Create Column</DialogTitle>
        <DialogContent sx={{
          width: 400,
          padding: 2
        }}>
        <TextField
            autoFocus
            margin="dense"
            id="text-field"
            label="Field Name"
            type="text"
             value={props.textValue}
            onChange={handleTextChange}
            fullWidth
          />
        
          
          <Select
            labelId="select-label"
            id="select"
            value={props.selectValue}
            onChange={(e)=>handleSelectChange(e)}
            defaultValue="Text"

            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            <MenuItem value="Text" >text</MenuItem>
            <MenuItem value="varchar">varchar</MenuItem>
            <MenuItem value="numeric">number</MenuItem>
            <MenuItem value="checkbox">checkbox</MenuItem>
            <MenuItem value="datetime">datetime</MenuItem>
            <MenuItem value="createdby">created By</MenuItem>
            <MenuItem value="createdat">created At</MenuItem>
            <MenuItem value="generatedcolumn">generated column</MenuItem>
            <MenuItem value="attachment">attachment</MenuItem>
            <MenuItem value="lookup">lookup</MenuItem>

          </Select>
          {showNumericOptions && (
              <Select
                labelId="numeric-select-label"
                id="numeric-select"
                value={props.selectValue}
                onChange={(e)=>handleSelectChange(e)}
                defaultValue="value"
                displayEmpty
                sx={{ margin: 1, minWidth: 120 }}
              >
                <MenuItem value="value">Select Type</MenuItem>
                <MenuItem value="integer">integer</MenuItem>
                <MenuItem value="decimal">decimal</MenuItem>
              </Select>
            )}
      {showDecimalOptions && (
        <Select
          labelId="decimal-select-label"
          id="decimal-select"
          value={props.decimalSelectValue}
          onChange={(e)=>{selectDecimalValue(e)}}
          defaultValue="1"
          displayEmpty
          sx={{ margin: 1, minWidth: 120 }}
        >
          <MenuItem value="Select">seledct decimal value </MenuItem>

          <MenuItem value="1">1.0</MenuItem>
          <MenuItem value="2">1.00</MenuItem>
          <MenuItem value="3">1.000</MenuItem>
          <MenuItem value="4">1.0000</MenuItem>
          <MenuItem value="5">1.00000</MenuItem>
          <MenuItem value="6">1.000000</MenuItem>
          <MenuItem value="7">1.0000000</MenuItem>
        </Select>
      )}


          {lookupField && <Select
            labelId="select-label"
            id="select"
            // value={props.selectValue.AllTableInfo.tables}
            // onChange={handleTableChange}
            defaultValue="text"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            {AllTableInfo.tables && Object.entries(AllTableInfo.tables).map((table, index) => (  
              <div key={index}>
                <MenuItem>{table[1]?.tableName}</MenuItem>
              </div>         
            ))}
          </Select>}
         {  openn && 

         (
          <Box>
            <Box>write query in human friendly way to manupulate the column and resultant query will be give to you !!!  and vie versa</Box>
               <TextField
            autoFocus
            margin="dense"
            id="text-field"
            label="Enter the query"
            type="text"
            // value={props?.textValue}
            placeholder={"multiply column speed and distance"}
           onChange={(e)=>{
            setUserQuery(e.target.value)
           }}
            fullWidth
          />
          <Button onClick={()=>{props?.submitData(userQuery)}} color="primary" >next</Button>

          { props?.queryByAi && <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Query by Ai"
          type="text"
          onChange={(e)=>{
            props?.setQueryByAi(e.target.value)
           }}
          placeholder={"resultant query"}
          value={props?.queryByAi && props?.queryByAi?.split("(")[1].split(")")[0]}
          fullWidth
        /> }
          </Box>
        
        )
          }

          <FormGroup>
            <FormControlLabel control={<Switch checked={props?.metaData?.unique} onClick={(e) => { handleSwitchChange(e) }} />} label="Unique" />
          </FormGroup>
        </DialogContent>
        <Button onClick={()=>{props?.submitData(false)}}color="primary" >Submit</Button>
      </Dialog>
      
    </div>
  );
}
FieldPopupModal.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  setOpenPopup: PropTypes.func,
  openPopup: PropTypes.bool,
  textValue: PropTypes.any,
  selectValue: PropTypes.any,
  setTextValue: PropTypes.func,
  setSelectValue: PropTypes.func,
  submitData: PropTypes.func,
  setMetaData: PropTypes.func,
  metaData: PropTypes.any,
  queryByAi:PropTypes.any,
  setQueryByAi:PropTypes.func,
  decimalSelectValue:PropTypes.any,
  setDecimalSelectValue:PropTypes.func,
}

