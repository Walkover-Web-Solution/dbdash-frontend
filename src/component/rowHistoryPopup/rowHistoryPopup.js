import React, {useState} from "react";
import { Box,  } from "@mui/material";
import PropTypes from "prop-types";
import Typography from '@mui/material/Typography';
import { customUseSelector } from "../../store/customUseSelector";
import {formatDateTime} from '../authKeyComponents/authKeyTable/authKeyTable'
import "./rowHistoryPopup.scss"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import {Select} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';

function RowHistoryPopup(props) {
  const {open , handleClose} = props;
  const tables = customUseSelector((state) => state.tables); // data from redux
  let rowHistory = tables.rowHistory ? [...tables.rowHistory] : []
  let allfields = "all#fields";
  let [field, setField] = useState(allfields);
  rowHistory = rowHistory.filter(o=>field === allfields || o.fieldid === field).sort((o1, o2)=>o2['updatedat'] - o1['updatedat']);
  return (
    <Dialog 
      onClose={handleClose} open={open}
      fullWidth
      maxWidth="lg"
    >
      <Box className="row-history-dialog">
      <DialogTitle className="row-history-header" variant="h4">
        History of Row {props.autonumber}
        <IconButton onClick={handleClose} className='close-button'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box className='row-history'>

      {
        tables.status === "loading" && (
          <CircularProgress color="inherit" />
          )
        }
      {
        tables.status === "succeeded" &&
        <Box className="success-div">
          <Box className="field-selector">
          <Typography>Choose a specific Field :</Typography>
          <Select
            className="field-dropdown"
            value={field}            
            onChange={(e)=>{setField(e.target.value)}}
          >
            <MenuItem key= {allfields} value= {allfields}>
              All Fields
            </MenuItem>
            {
              props.fields.map((field)=>{
                return (
                  <MenuItem key={field.id} value={field.id}>{field.title}</MenuItem>
                )
              })
            }
          </Select>
        </Box>
          {
            rowHistory.length > 0 ? 
            <Box>
            <List sx={{ pt: 0 }}>
              {
                rowHistory.map((history, index)=>{
                  const user = tables.userDetail?.[history['updatedby']];
                  const time = formatDateTime(history['updatedat']*1000);
                  return (
                    <ListItem className = "edited-item" key={index}>
                      <Box className="edited-by">
                        <Typography className="edited-name">{user ? user.first_name + " " + user.last_name : "Deleted User"} edited this record.</Typography>
                        <Typography className = "edited-time">{time}</Typography>
                      </Box>
                      <Box className = "edited-field">
                        <Typography className="edited-field-id">{history['fieldid']}</Typography>
                        <Typography className = "edited-value">{history['data'] ? <span>{history['data']}</span> : "null"}</Typography>
                      </Box>
                    </ListItem>
                  )
                })
              }
            </List>
            </Box> : 
            <Typography className='no-history' variant="h6">No Revision History Found</Typography>
          }  
        </Box>
      }
      {
        tables.status === 'failed' && (
          <Typography>Failed to fetch data</Typography>
          )
        }
    </Box>
    </Box>
    </Dialog>
  );
}

RowHistoryPopup.propTypes = {
    handleClose : PropTypes.func,
    open : PropTypes.bool,
    autonumber : PropTypes.number,
    fields : PropTypes.array
};
export default RowHistoryPopup;