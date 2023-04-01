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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
export default function FieldPopupModal(props) {
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  console.log(AllTableInfo?.tables)
  const [lookupField,setLookupField] = useState(false)
  const [selectedTable, setSelectedTable] = useState('text');
  

  // console.log(props)
  const handleSwitchChange = (event) => {
    props?.setUnique(event.target.checked);
  };
  const handleTextChange = (event) => {
    props?.setTextValue(event.target.value);
  };
  const handleSelectChange = (event) => {
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
  };
  const handleClose = () => {
    props?.setOpen(false);
    // props.setOpenPopup(false);
  };
  
  const isInputEmpty = props?.textValue.trim() === '';

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
            label="Text Field"
            type="text"
             value={props.textValue}
          //  /  {console.log("value",props.textValue)}
            onChange={handleTextChange}
            fullWidth
          />
          <Select
            labelId="select-label"
            id="select"
            value={props.selectValue}
            onChange={handleSelectChange}
            defaultValue="text"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            {/* <MenuItem value="">Select an option</MenuItem> */}
            <MenuItem value="text" >text</MenuItem>
            <MenuItem value="varchar">varchar</MenuItem>
            <MenuItem value="integer">integer</MenuItem>
            <MenuItem value="checkbox">checkbox</MenuItem>
            <MenuItem value="datetime">datetime</MenuItem>
            <MenuItem value="createdby">created By</MenuItem>
            <MenuItem value="createdat">created At</MenuItem>
            <MenuItem value="attachment">attachment</MenuItem>
            <MenuItem value="lookup">lookup</MenuItem>

          </Select>

          {lookupField && <Select
            labelId="select-label"
            id="select"
            // value={props.selectValue}
            // onChange={handleTableChange}
            value={selectedTable}
            onChange={(event) => setSelectedTable(event.target.value)}
            defaultValue="text"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
                
            {AllTableInfo.tables && Object.entries(AllTableInfo.tables).map((table, index) => (  
              
                //\ <MenuItem>{table[1]?.tableName}</MenuItem>
                <MenuItem key={index} value={table[1]?.tableName}>{table[1]?.tableName}</MenuItem> 
                
            ))}
            
          </Select>}
              
            
          <FormGroup>
            <FormControlLabel control={<Switch checked={props?.unique} onClick={(e) => { handleSwitchChange(e) }} />} label="Unique" />
          </FormGroup>
        </DialogContent>
        <Button onClick={props?.submitData} color="primary" disabled={isInputEmpty}>Submit</Button>
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
  setUnique: PropTypes.func,
  unique: PropTypes.any
}

