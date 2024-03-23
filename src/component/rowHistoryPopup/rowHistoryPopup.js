import React, {useState} from "react";
import { Box, Tooltip,  } from "@mui/material";
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
import UndoIcon from '@mui/icons-material/Undo';
import { useDispatch } from "react-redux";
import { updateCells } from "../../store/table/tableThunk";
import { toast } from "react-toastify"
import { useParams } from "react-router";
function RowHistoryPopup(props) {
  const {open , handleClose} = props;
  const tables = customUseSelector((state) => state.tables); // data from redux
  const rowData = customUseSelector(state => state.table.data[props.rowIndex]);
  let rowHistory = tables.rowHistory ? [...tables.rowHistory] : []
  const dispatch = useDispatch();
  const params = useParams();
  let allfields = "all#fields";
  let [field, setField] = useState(allfields);
  rowHistory = rowHistory.filter(row => field === allfields || row.fieldid === field);
const revertChange = (fieldId, value) => {
  const field = tables.tables[params.tableName].fields[fieldId];
  const isMultipleSelect = field.fieldType === "multipleselect";
  const isAttachment = field.fieldType === "attachment";

  if (isMultipleSelect) {
    value = value.substring(1, value.length - 1).split(",");
  }

  const prevState = isAttachment ? (value ? value.substring(1, value.length - 1).split(",") : []) : value;
  const rowDataFieldValue = rowData[fieldId];

  if (rowDataFieldValue?.join(',') === prevState.join(',')) {
    toast.info(`${fieldId} is already set to the desired value.`);
    return;
  }

  const { addedLinks, deletedLinks } = getAddedAndDeletedLinks(isAttachment, rowDataFieldValue, prevState);

  const updatedArray = [];
  if (isAttachment && addedLinks.length > 0) {
    updatedArray.push(createUpdateObject(fieldId, props.autonumber, 'restore', addedLinks));
  }

  if (isAttachment && deletedLinks.length > 0) {
    updatedArray.push(createUpdateObject(fieldId, props.autonumber, 'delete', deletedLinks));
  } else if (!isAttachment && rowDataFieldValue !== value) {
    updatedArray.push(createUpdateObject(fieldId, props.autonumber, 'update', value));
  }

  dispatchAndUpdateCells(updatedArray, fieldId);
}

const getAddedAndDeletedLinks = (isAttachment, currentLinks, previousLinks) => {
  if (!isAttachment) {
    return { addedLinks: [], deletedLinks: [] };
  }

  const currentStateSet = new Set(currentLinks);
  const previousStateSet = new Set(previousLinks);

  const deletedLinks = currentLinks.filter(link => !previousStateSet.has(link));
  const addedLinks = previousLinks.filter(link => !currentStateSet.has(link));

  return { addedLinks, deletedLinks };
};

const createUpdateObject = (fieldId, autonumber, action, links) => {
  return {
    where: `autonumber = ${autonumber}`,
    fields: { [fieldId]: { [action]: links } },
  };
};

const dispatchAndUpdateCells = (updatedArray, fieldId) => {
  dispatch(updateCells({
    updatedArray,
    indexIdMapping: { [props.autonumber]: props.rowIndex },
    oldData: rowData[fieldId]
  })).then((res) => {
    if (!res.error) {
      toast.success(`Updated ${fieldId} successfully`);
    }
  });
};

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
                      <Box width="100%">
                        <Box className="edited-by">
                          <Typography className="edited-name">{user ? user.first_name + " " + user.last_name : "Deleted User"} edited this record.</Typography>
                          <Typography className = "edited-time">{time}</Typography>
                        </Box>
                        <Box className = "edited-field">
                          <Typography className="edited-field-id">{history['fieldid']}</Typography>
                          <Typography className = "edited-value">{history['data'] ? <span>{history['data']}</span> : "null"}</Typography>
                        </Box>
                      </Box>
                      <Tooltip className = "revert-button" title="Revert to this change">
                        <IconButton size = "large" onClick = {()=>{revertChange(history['fieldid'], history['data'])}}>
                          <UndoIcon />
                        </IconButton>
                      </Tooltip>
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
    fields : PropTypes.array,
    rowIndex : PropTypes.number,
};
export default RowHistoryPopup;