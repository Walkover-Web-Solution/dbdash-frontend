import React, { useState } from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
// import ListItem from '@mui/material/ListItem';
import CloseIcon from '@mui/icons-material/Close';

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import AppBar from '@mui/material/AppBar';

// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import PropTypes from "prop-types";
import { makeStyles } from '@mui/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import AddOptionPopup from '../addOptionPopup/addOptionPopup';
// import variables from '../../../assets/styling.scss';
import './manageFieldDropDown.scss'
import { useParams } from 'react-router-dom';
import { updateColumnHeaders } from '../../../store/table/tableThunk';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  dialogContainer: {
    maxWidth: 'none',
    width: '60vw'
  },
});

export default function ManageFieldDropDown(props) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const fields1 = useSelector((state) => state.table.columns);
  const [openAddFields, setOpenAddFields] = React.useState(false);
  const [fieldId, setFieldId] = useState("");
  const [fieldType, setFieldType] = useState("");
  const params = useParams();

  const handleClose = () => {
    props.setOpenManageField(false);
  };
  const columnId = (fieldid, fieldType) => {
    setFieldId(fieldid)
    setFieldType(fieldType)
  }
  const handleOpen = () => {
    if (params.templateId) return;

    setOpenAddFields(true)
  };
  var defaultArr = fields1.map((column) => {
    return !column?.metadata?.hide;
  })

  const hideColumn = async (columnId, isChecked) => {
    if (params.templateId) return;
    const metaData = { hide: isChecked };
    dispatch(
      updateColumnHeaders({
        dbId: params?.dbId,
        tableName: params?.tableName,
        columnId: columnId,
        metaData: metaData,
        filterId: params?.filterName
      })
    );
  };
  const toggleColumn = (columnId, i) => {
    var newArr = [...defaultArr]
    newArr[i] = !newArr[i]
    defaultArr = newArr
    hideColumn(columnId, !newArr[i]);
  };
  return (
    <div>
      <Dialog
        open={props.setOpenManageField}
        classes={{
          paper: classes.dialogContainer,
        }} onClose={handleClose}
        TransitionComponent={Transition}
      >
        {/* <AppBar sx={{ position: 'relative' ,backgroundColor:`${variables.basictextcolor}`}}>
          <Toolbar >
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>{handleClose()}}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar> */}
        <TableContainer component={Paper}>
          <div className="popupheader">    
          <Typography className="manageFiledDropDown-typograhy" id="title" variant="h6" component="h2">
            manage fields
          </Typography>
          <CloseIcon className="manageFiledDropDown-closeIcon"   onClick={handleClose} /></div>


          <Table aria-label="My Table">
            <TableHead  >
              <TableRow >
                <TableCell  className="manageFiledDropDown-TableCell">Field Name</TableCell>
                <TableCell  className="manageFiledDropDown-TableCell">Visible</TableCell>

                <TableCell  className="manageFiledDropDown-TableCell">Field Type</TableCell>
                <TableCell  className="manageFiledDropDown-TableCell">Options</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {fields1.map((field, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell  className="manageFiledDropDown-TableCell">{field.title}</TableCell>
                    <TableCell  className="manageFiledDropDown-TableCell-2" >
                      <input
                        style={{
                          width: "15px",
                          height: "15px",

                        }}
                        type="checkbox"
                        checked={defaultArr[index]}
                        onChange={() => toggleColumn(field?.id, index)}
                      />


                    </TableCell>
                    <TableCell  className="manageFiledDropDown-TableCell" >{field.dataType}</TableCell>


                    {field.dataType === "singleselect" || field.dataType === "multipleselect" ? (
                      <TableCell className="manageFiledDropDown-TableCell-3" >
                        <div style={{ width: '200px' }}>
                          {field?.metadata?.option?.map((value, index) => {
                            return index < 3 ? (value.value || value) : null;
                          }).filter(Boolean).join(', ')}
                          {field?.metadata?.option?.length > 3 && field?.metadata?.option?.length <= 20 ? '...' : ''}
                        </div>


                        <div >
                          <ModeEditOutlineOutlinedIcon
                            onClick={() => {
                              handleOpen();
                              columnId(field.id, field.dataType);
                            }}
                          />
                        </div>
                      </TableCell>

                    ) : (
                      <TableCell></TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </TableContainer>
      </Dialog>
      <AddOptionPopup openAddFields={openAddFields} fieldType={fieldType} columnId={fieldId} setOpenAddFields={setOpenAddFields} />
    </div>
  );
}

ManageFieldDropDown.propTypes = {
  setOpenManageField: PropTypes.any,
}