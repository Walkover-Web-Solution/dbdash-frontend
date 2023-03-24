import React,{useState,useEffect} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Select, MenuItem } from '@mui/material';
import { getAllfields } from "../api/fieldApi";
import {createFilter} from "../api/filterApi"

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

export default function FilterModal(props) {
  // const [org, setOrg] = React.useState();
  const handleClose = () => props.setOpen(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [fieldData,setFieldData] = useState('');
  const [table,setTable] = useState();
  const [filterName,setFilterName] = useState('');
  const [valuee,setValuee] = useState('');
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChangee = (event) => {
    setTable(event.target.value);
  };

  useEffect(()=>{
    tableData();
  },[props])


  const tableData = async () => {

    const data = await getAllfields(props?.dbId, props?.tableName)
    setFieldData(data?.data?.data?.fields)
    console.log("field",props)
  }

  const getQueryData = async()=>{
    let query = "";
    if(selectedOption == "LIKE" || selectedOption == "NOT LIKE" )
    {
        query = "select * from " + props?.tableName + " where " + table + " " + selectedOption + "'%" + valuee + "%'"
    }
    else if(selectedOption == "=" || selectedOption == "!=" ) 
    {
        query = "select * from " + props?.tableName + " where " + table + " " + selectedOption +" '" + valuee + "'"
    }
    const dataa={
        filterName:filterName,
        query: query
    }
     await createFilter(props?.dbId,props?.tableName,dataa)
  }

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
            <Box>
          <Typography id="title" variant="h6" component="h2">
            Create filter
          <input type="text" placeholder="enter filter name" onChange={(e)=>{
            setFilterName(e.target.value)
          }}/>

          </Typography>
          </Box>
          <Box sx={{ my: 2 }}>
            <Button>WHERE</Button>
            <Select onChange={handleChangee} value={table}>
            {fieldData && Object.entries(fieldData).map((fields, index) => ( 
                <MenuItem key={index} value={fields[0]}>
                    {fields[1].fieldName}
            </MenuItem>
            ))}
               
            </Select>
            <Select onChange={handleChange} >
                <MenuItem value="LIKE">contains</MenuItem>
                <MenuItem value="NOT LIKE">does not contain</MenuItem>
                <MenuItem value="=">is</MenuItem>
                <MenuItem value="!=">is not</MenuItem>
            </Select>
          </Box>
          <Box><input type="text" onChange={(e)=>{
            setValuee(e.target.value)
          }}/></Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Button variant="contained" onClick={()=>{
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
  dbId:PropTypes.any,
  tableName:PropTypes.any
};
