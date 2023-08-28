import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Slide from '@mui/material/Slide';
import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import {  useDispatch } from 'react-redux';
import AddOptionPopup from '../addOptionPopup/addOptionPopup';
// import variables from '../../../assets/styling.scss';
import './manageFieldDropDown.scss'
import { useParams } from 'react-router-dom';
import { updateColumnHeaders } from '../../../store/table/tableThunk';
import { customUseSelector } from '../../../store/customUseSelector';
// import { manageFieldDropDownStyles } from '../../../muiStyles/muiStyles';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function ManageFieldDropDown(props) {
  const dispatch = useDispatch();

  // const classes = manageFieldDropDownStyles();
  const fields1 = customUseSelector((state) => state.table.columns);
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
        // classes={{
        //   paper: classes.dialogContainer,
        // }}
         onClose={handleClose}
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