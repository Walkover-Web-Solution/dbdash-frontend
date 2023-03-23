import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Select, MenuItem, TextField } from '@mui/material';
import { getAllfields } from "../api/fieldApi";
import { createFilter } from "../api/filterApi"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function FilterModal(props) {
  // const [org, setOrg] = React.useState();
  // const [filterInput, setFilterInput] = useState(['input1']);
  // const [selectField,setSelectField] = useState(['selectFields1'])
  // const [selectCommand,setSelectCommand] = useState(['selectCommand1'])
  // const [AndOr,setAndOr] = useState([AndOr])
  const handleClose = () => props.setOpen(false);
  const [fieldData, setFieldData] = useState("");
  const[andOrSelect,setAndOrSelect] = useState("")
  console.log(andOrSelect)
  const [selectedOption, setSelectedOption] = useState(['option1']);
  const[fields,setFields] = useState(['field1'])
  const [AndOr,setAndOr] = useState(['input1'])
  const [valuee, setValuee] = useState(['input1']);
  const [table, setTable] = useState();
  const [filterName, setFilterName] = useState('');
  const handleChange = (event) => {
    setSelectedOption([event.target.value]);
  };

  const handleChangeAndOr = (event) => {
    setAndOrSelect(event.target.value);
  };

  const handleAddInput = () => {
    // console.log(filterInput,selectField,selectCommand)
    const newInput = `input${valuee.length + 1}`;
    setValuee([...valuee, newInput]);
    const selectFields = `input${fields.length + 1}`;
    setFields([...fields, selectFields]);
    const selectCommands = `input${selectedOption.length + 1}`;
    setSelectedOption([...selectedOption, selectCommands]);
    const AndOR = `input${AndOr.length + 1}`;
    setAndOr([...AndOr, AndOR]);
  };
  const handleChangee = (event) => {
    setTable(event.target.value);
    console.log(table)
  };

  useEffect(() => {
    tableData();
  }, [props])
  const tableData = async () => {

    const data = await getAllfields(props?.dbId, props?.tableName)
    setFieldData(data?.data?.data?.fields)
  }

  const getQueryData = async () => {
    console.log("selectedOption", selectedOption)
    let query = "";
    if (selectedOption == "LIKE" || selectedOption == "NOT LIKE") {
      query = "select * from " + props?.tableName + " where " + table + " " + selectedOption + "'%" + valuee + "%'"
    }
    else if (selectedOption == "=" || selectedOption == "!=") {
      query = "select * from " + props?.tableName + " where " + table + " " + selectedOption + " '" + valuee + "'"
    }
    const dataa = {
      filterName: filterName,
      query: query
    }
    const data = await createFilter(props?.dbId, props?.tableName, dataa)
    console.log("data", data?.data?.data)
  }

  return (
    <Box >
      <Modal
        disableRestoreFocus
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box style={{ display: "flex", flexDirection: "row" }}>

            <Typography id="title" variant="h6" component="h2">
              Create filter
            </Typography>

            <Box>

              <TextField autoFocus sx={{ width: 150, height: 60, fontWeight: 'bold' }} type="text" placeholder="enter filter name" onChange={(e) => {
                setFilterName(e.target.value)
              }} />

              <Box />
            </Box>
          </Box>

                {console.log("andor = ",AndOr)}
                {console.log("fields = ",fields)}
                {console.log("selectedOptions = ",selectedOption)}
                {console.log("valuee = ",valuee)}


         <Box style={{ display: "flex", flexDirection: "row" }}>
            <Box><Button style={{ padding: "14%" }}>WHERE</Button></Box>


            
           <Box>
            {AndOr?.map((input) => {
                // if (AndOr?.length !=0 ) {
                  return (
                    <Select key={input} onChange={handleChangeAndOr}>
                      <MenuItem value="&&">and</MenuItem>
                      <MenuItem value="||">or</MenuItem>
                    </Select>
                  );
                // }
              })}
            </Box>
            <Box>
            {fields?.map((input) => (
              <Select key={input} onChange={handleChangee} >
                {fieldData && Object.entries(fieldData).map((fields, index) => (
                  <MenuItem key={index} value={fields[0]} >
                    {fields[1].fieldName}
                  </MenuItem>
                ))}
              </Select>
               ))}
            </Box>

            <Box>
            {selectedOption?.map((input) => (
              <Select key={input} onChange={handleChange} >
                <MenuItem value="LIKE">contains</MenuItem>
                <MenuItem value="NOT LIKE">does not contain</MenuItem>
                <MenuItem value="=">is</MenuItem>
                <MenuItem value="!=">is not</MenuItem>
              </Select>
                ))}
            </Box>

            <Box>
              {valuee.map((input) => (
                <TextField key={input} sx={{ width: 150, height: 60, fontWeight: 'bold' }} placeholder="Enter the value" type="text" onChange={(e) => {
                  setValuee([e.target.value])
                }} />
              ))}
            </Box>


          </Box>
          <Button onClick={handleAddInput}>+</Button>


          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Button variant="contained" onClick={() => {
                getQueryData();
                handleClose()
              }}>
                Create
              </Button>
            </Box>
            <Box>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

FilterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any
};
