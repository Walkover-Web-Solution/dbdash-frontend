import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Box } from '@mui/system';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { getAllTableInfo } from '../store/allTable/allTableSelector';

export default function FieldPopupModal(props) {
  const [openn, setOpenn] = useState(false);
  const [userQuery, setUserQuery] = useState(false);
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const [lookupField, setLookupField] = useState(false)
  // const [selectedTable, setSelectedTable] = useState("");
  // const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  // const [selectedFieldName, setSelectedFieldName] = useState(false);

  const handleSwitchChange = (event) => {
    var data = props?.metaData;
    data.unique = event.target.checked
    props?.setMetaData(data);
  };
  const handleTextChange = (event) => {
    props?.setTextValue(event.target.value);
  };
  const handleSelectChange = (event) => {
    if (event.target.value == "generatedcolumn") {
      setOpenn(true)
      props?.setSelectValue(event.target.value);
    }
    else if (event.target.value == "lookup") {
      setLookupField(true)
      props?.setSelectValue(event.target.value);
    }
    else {
      props?.setSelectValue(event.target.value);
      setOpenn(false)
    }
  };
  const handleClose = () => {
    props?.setOpen(false);
    setOpenn(false);
    setLookupField(false)
    setUserQuery(false)
    props?.setShowFieldsDropdown(false)
    props?.setSelectedFieldName(false)
    props?.setSelectValue("Text");
    props?.setTextValue("");
    props?.setMetaData({});
  };


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
        <TextField
          autoFocus
          margin="dense"
          id="text-field"
          label="Field Name"
          type="text"
          value={props.textValue}
          //  /  {console.log("value",props.textValue)}
          onChange={handleTextChange}
          fullWidth
        />
        <DialogContent sx={{
          width: 400,
          padding: 2
        }}>

          <Select
            labelId="select-label"
            id="select"
            value={props.selectValue}
            onChange={handleSelectChange}
            defaultValue	 ="Text"
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

          {openn &&

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
                  onChange={(e) => {
                    setUserQuery(e.target.value)
                  }}
                  fullWidth
                />
                <Button onClick={() => { props?.submitData(userQuery) }} color="primary" >next</Button>

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
          value={props?.queryByAi && props?.queryByAi}
          fullWidth
        /> }
          </Box>
        
        )
          }
          {lookupField && <Select
            labelId="select-label"
            id="select"
            value={props?.selectedTable}
            onChange={(event) => {
              console.log("SDFSDFSD", event.target.value)
              props?.setSelectedTable(event.target.value);
              props?.setShowFieldsDropdown(true)
            }}
            defaultValue={props?.selectedTable}
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
          >
            {AllTableInfo?.tables && Object.entries(AllTableInfo?.tables).map((table, index) => (
              <MenuItem key={index} value={table[0]}>{table[1]?.tableName}</MenuItem>
            ))}
          </Select>}
          {props?.showFieldsDropdown && (<Select
            labelId="select-label"
            id="select"
            value={props?.selectedFieldName}
            defaultValue="fields"
            displayEmpty
            sx={{
              margin: 1,
              minWidth: 120,
            }}
            onChange={(e) => props?.setSelectedFieldName(e.target.value)}
          >
            {
              Object.entries(AllTableInfo.tables[props?.selectedTable]?.fields)?.filter((fields) => {
                if (fields[1]?.metaData?.unique) {
                  return fields;
                }
              })
                .map((fields) =>
                (
                  <MenuItem key={fields[0]} value={fields[0]}>
                    {fields[1]?.fieldName}
                  </MenuItem>
                ))
            }
          </Select>
          )}


          <FormGroup>
            <FormControlLabel control={<Switch checked={props?.metaData?.unique} onClick={(e) => { handleSwitchChange(e) }} />} label="Unique" />
          </FormGroup>
        </DialogContent>
        <Button onClick={() => { props?.submitData(false) }} color="primary" >Submit</Button>
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
  queryByAi: PropTypes.any,
  setQueryByAi: PropTypes.func,
  setMetaData: PropTypes.func,
  metaData: PropTypes.any,
  setShowFieldsDropdown:PropTypes.func,
  showFieldsDropdown:PropTypes.any,
  setSelectedTable:PropTypes.func,
  selectedTable:PropTypes.any,
  selectedFieldName:PropTypes.any,
  setSelectedFieldName:PropTypes.func
}

