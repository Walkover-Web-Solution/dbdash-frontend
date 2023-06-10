import React, {useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { Add, Cancel } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateColumnHeaders, updateMultiSelectOptions } from "../../store/table/tableThunk";
import { getTableInfo } from "../../store/table/tableSelector";
import { toast } from 'react-toastify';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddOptionPopup(props) {
  const handleClose = () => props.setOpenAddFields(false);
  const [inputValues, setInputValues] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
 const fields1 = useSelector((state) => state.table.columns);

  const colors = ["#FFD4DF", "#CCE0FE", "#CEF5D2","whitesmoke","cadetblue"];

  

  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === props?.columnId);
  let top100Films = metaDataArray[0]?.metadata?.option || [];
  const handleAddClick = () => {
    setInputValues([...inputValues, ""]);
  };
  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  useEffect(() => {
    fields1.forEach((field) => {
      if (field.id === props.columnId && field.dataType === "singleselect") {
        const optionValue = field?.metadata?.option || [];
        setInputValues(optionValue);
      }
      else if (field.id === props.columnId && field.dataType === "multipleselect") {
        const optionValue = field?.metadata?.option || [];
        const values = optionValue.map((item) => item.value); 
        setInputValues(values);
      }
    });
  }, [fields1, props.columnId]);
   
  function getRandomColor(colors) {
    let index = colors.indexOf((top100Films).slice(-1)[0]?.color) + 1;
    index = index % colors.length;
    return colors[index];
  }

  const handleInputKeyPress = (event) => {
    const value= event?.target?.value
   
    if (event.key === "Enter") {
      // fields1.map((field) => {
        if (props?.fieldType === "multipleselect") {
          const data = {
            value: event?.target?.value,
            color: getRandomColor(colors),
          };
          const updatedMetadata = [
            ...top100Films,data
          ];
  
          dispatch(updateMultiSelectOptions({
            dbId: params?.dbId,
            tableName: params?.tableName,
            fieldName: props?.columnId,
            columnId: props?.columnId,
            dataTypes: "multipleselect",
            metaData: updatedMetadata,
          }));
        } else if (props?.fieldType === "singleselect") {
          if( !(top100Films).includes(value)){
            const updatedMetadata = [...top100Films,value];
          dispatch(updateColumnHeaders({
            dbId: params?.dbId,
            tableName: params?.tableName,
            fieldName: props?.columnId,
            columnId: props?.columnId,
            dataTypes: "singleselect",
            metaData: { option: updatedMetadata} 
          }));
          toast.success("Option added sucessfully")
          // setInputValues([...inputValues, ""]);
          }
        }
      // });
    }
  };
  
  

  const handleCancelClick = (index) => {
    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);
  };

  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={props.openAddFields}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
                  
          <Typography variant="h6" component="h2">
            Add options
          </Typography>
          <Box sx={{ my: 2 }}>
            {inputValues.map((value, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                autoFocus
                  id={`input-${index}`}
                  label="Standard"
                  variant="standard"
                  value={value}
                  onChange={(event) => handleInputChange(event, index)}
                  onKeyPress={(event) => handleInputKeyPress(event, index)}
                />
                <Cancel
                  onClick={() => handleCancelClick(index)}
                  sx={{ cursor: "pointer", marginLeft: "8px" }}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddClick}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

AddOptionPopup.propTypes = {
  openAddFields: PropTypes.bool,
  setOpenAddFields: PropTypes.func,
  submitData: PropTypes.func,
  dataType :PropTypes.any,
  columnId: PropTypes.any,
  fields:PropTypes.any,
  fieldType:PropTypes.any
};
