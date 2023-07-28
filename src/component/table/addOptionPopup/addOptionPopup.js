import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { Add, Cancel } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateColumnHeaders, updateMultiSelectOptions } from "../../../store/table/tableThunk";
import { getTableInfo } from "../../../store/table/tableSelector";
import { toast } from 'react-toastify';
import './addOptionPopup.scss'
import { customUseSelector } from "../../../store/customUseSelector";
import CustomTextField from "../../../muiStyles/customTextfield";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  maxHeight:'500px',
  overflowY:'auto',
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
  const [value, setValue] = useState("");
  const fields1 = customUseSelector((state) => state.table.columns);

  const colors = ["#FFD4DF", "#CCE0FE", "#CEF5D2", "whitesmoke", "cadetblue"];

  const [valueAndColor, setValueAndColor] = useState();

  const tableInfo = customUseSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === props?.columnId);
  let top100Films = metaDataArray[0]?.metadata?.option || [];

  const handleAddClick = () => {
    if (value !== "") {
      if (props?.fieldType === "multipleselect") {
        if (top100Films.some((item) => item.value.trim() === value)) {
          toast.error("This option already exists");
        } else {
          const data = {
            value: value,
            color: getRandomColor(colors),
          };
          const updatedMetadata = [...top100Films, data];

          dispatch(
            updateMultiSelectOptions({
              dbId: params?.dbId,
              tableName: params?.tableName,
              fieldName: props?.columnId,
              columnId: props?.columnId,
              dataTypes: "multipleselect",
              metaData: updatedMetadata,
            })
          );
          toast.success("Option added successfully");
          setValue("");
        }
      } else if (props?.fieldType === "singleselect") {
        if (top100Films.includes(value.trim())) {
          toast.error("The value is already available");
        } else {
          const updatedMetadata = [...top100Films, value];
          dispatch(
            updateColumnHeaders({
              dbId: params?.dbId,
              tableName: params?.tableName,
              fieldName: props?.columnId,
              columnId: props?.columnId,
              dataTypes: "singleselect",
              metaData: { option: updatedMetadata },
            })
          );
          toast.success("Option added successfully");
         setValue("");
        }
      }
    } else {
      toast.error("Please enter a value");
    }
    const textField = document.getElementById("myTextField");
    textField.focus();
  };

  // const handleInputChange = (event, index) => {
  //   const newInputValues = [...inputValues];
  //   newInputValues[index] = event.target.value;
  //   setInputValues(newInputValues);
  // };

  useEffect(() => {
    fields1.forEach((field) => {
      if (field.id === props.columnId && field.dataType === "singleselect") {
        const optionValue = field?.metadata?.option || [];
        setInputValues(optionValue);
      } else if (field.id === props.columnId && field.dataType === "multipleselect") {
        const optionValue = field?.metadata?.option || [];
        const valueandcolor = optionValue.map((item) => item);
        const values = optionValue.map((item) => item.value);
        setInputValues(values);
        setValueAndColor(valueandcolor);
      }
    });
  }, [fields1, props.columnId]);

  function getRandomColor(colors) {
    let index = colors.indexOf((top100Films).slice(-1)[0]?.color) + 1;
    index = index % colors.length;
    return colors[index];
  }

  const handleInputKeyPress = (event) => {

    if (event.key === "Enter") {
     handleAddClick();

     event.target.value="";
    }
  };

  const handleCancelClick = (index, inputValues) => {
    if (props?.fieldType === "multipleselect") {
      const newInputValues = [...valueAndColor];
      newInputValues.splice(index, 1);
      dispatch(
        updateColumnHeaders({
          dbId: params?.dbId,
          tableName: params?.tableName,
          columnId: props?.columnId,
          metaData: { option: newInputValues },
        })
      );
    } else {
      const newInputValues = [...inputValues];
      newInputValues.splice(index, 1);
      setInputValues(newInputValues);
      dispatch(
        updateColumnHeaders({
          dbId: params?.dbId,
          tableName: params?.tableName,
          columnId: props?.columnId,
          metaData: { option: newInputValues },
        })
      );
    }
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
        <Box sx={style} >
        <div >
          <Typography variant="h6" component="h2">
            Add options
          </Typography></div>
          <Box className='addoption-container'>
            {inputValues.map((val, index) => (
              <Box key={index} className='addOption-textfield'>
                <CustomTextField
                  id={`input-${index}`}
                  variant="standard"
                  label="saved option"
                  value={val}

                  // onChange={(event) => handleInputChange(event, index)}
                  // onKeyPress={handleInputKeyPress}
                />
                <Cancel
                  onClick={() => handleCancelClick(index, inputValues)}
                  className="addOption-cancel"
                />
              </Box>
            ))}
            <Box className='addOption-textfield'>
              <CustomTextField
                autoFocus
                id="myTextField"
                label="Enter"
                variant="standard"
                value={value}
                onChange={(event) => setValue(event.target.value.trim())}
                onKeyDown={handleInputKeyPress}
              />
            </Box>
          </Box>
          <Box className='addOption-addbox'>
            <Button className="mui-button" variant="contained" startIcon={<Add />} onClick={handleAddClick}>
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
  dataType: PropTypes.any,
  columnId: PropTypes.any,
  fields: PropTypes.any,
  fieldType: PropTypes.any,
};
