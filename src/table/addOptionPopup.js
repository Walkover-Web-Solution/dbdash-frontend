import React, {useState } from "react";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { Add, Cancel } from "@mui/icons-material";
import { updateColumnHeaders, updateMultiSelectOptions } from "../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getTableInfo } from "../store/table/tableSelector";

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
  console.log(props,"prrops")
  const handleClose = () => props.setOpen(false);
  const [inputValues, setInputValues] = useState([]);
  // const [singleSelectFields,setSingleSelectFields] = useState("")
  const params = useParams();
  const dispatch = useDispatch();
  const colors = ["#FFD4DF", "#CCE0FE", "#CEF5D2","whitesmoke","cadetblue"];

  function getRandomColor(colors) {
    let index = colors.indexOf(top100Films.slice(-1)[0]?.color) + 1;
    index = index % colors.length;
    return colors[index];
  }

  const tableInfo = useSelector((state) => getTableInfo(state));
  const metaDataArray = tableInfo?.columns.filter(obj => obj.id === props?.columnId);
  const top100Films = metaDataArray[0]?.metadata?.option || [];
  const handleAddClick = () => {
    setInputValues([...inputValues, ""]);
  };

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    console.log(newInputValues,"newinputvalues")
    setInputValues(newInputValues);
  };

  // useEffect(()=>{
  //   if(props?.fields != null){  
  //     console.log(props?.fields,"props.fields")
  //     const singleSelectObjects = [];
  //     for (let key in props?.fields) {
  //       if (object.hasOwnProperty(key)) {
  //         const field = props?.fields[key];
  //         if (field.fieldType === "singleselect") {
  //           singleSelectObjects.push(field);
  //         }
  //       }
  //     }
  //       console.log(singleSelectFields,"fieldssssssssssssssssssssssssssss  ")
  //   }
  //     setSingleSelectFields(singleSelectFields)
  //   },[singleSelectFields])
    
    // console.log(singleSelectFields,"fields of idngleselft")
  const handleInputKeyPress = (event) => {
    console.log("top100Films",top100Films)
    console.log("columnId",props?.columnId)
    const updatedMetadata = [...top100Films,  { value: event?.target?.value
      , color: getRandomColor(colors)
     }];
    if (event.key === "Enter") {
      console.log("jdfgbhxgbxhc")
        if (props?.dataType == "multiselect") {
            const data =
             { value: event?.target?.value
              , color: getRandomColor(colors)
             };
            console.log(data,"data")
            const updatedMetadata = [...top100Films,  { value: event?.target?.value
              , color: getRandomColor(colors)
             }];
            dispatch(updateMultiSelectOptions({
                dbId: params?.dbId,
                tableName: params?.tableName,
              fieldName: props?.columnId,
              columnId: props?.columnId,
              dataTypes: "multipleselect",
              metaData: { option: updatedMetadata},
            }));
          }
        dispatch(
            updateColumnHeaders({
              dbId: params?.dbId,
              tableName: params?.tableName,
              fieldName: props?.columnId,
              columnId: props?.columnId,
              dataTypes: "singleselect",
              metaData: { option: updatedMetadata},
            })
          );
      // Perform the desired action with the input value
      console.log("Input value:", inputValues);
    }
  };

  const handleCancelClick = (index) => {
    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);
  };

  const handleChangeSelectedOption = () => {
    // if(event.target.value == "singleselect"){
    //   const singleSelectFields = Object.entries(props?.fields)
    //   .filter(([key, value]) => value.fieldType === "singleselect")
    //   .map(([key, value]) => value.fieldName);
        console.log(props?.fields,"fields")
    // }
  };

  return (
    <Box>
      <Modal
        disableRestoreFocus
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Select sx={{ width: 150 }}
                    value={ "singleselect"}
                    defaultValue="singleselect"
                    // key={q?.value}
                    onChange={(e) => handleChangeSelectedOption(e)}
                    >
                    <MenuItem value="singleselect">Single Select</MenuItem>
                    <MenuItem value="multipleselect">Multiple Select</MenuItem>
                  </Select>

                  
          <Typography variant="h6" component="h2">
            Add options
          </Typography>
          <Box sx={{ my: 2 }}>
            {inputValues.map((value, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <TextField
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
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  submitData: PropTypes.func,
  dataType :PropTypes.any,
  columnId: PropTypes.any,
  fields:PropTypes.any
};
