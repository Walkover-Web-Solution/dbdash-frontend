import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { Select, MenuItem, TextField } from '@mui/material';
// import { getAllfields } from "../api/fieldApi";
import { createFilter } from "../api/filterApi"
import { getTableInfo } from "../store/table/tableSelector";
import { useSelector } from "react-redux";
import { cloneDeep } from "lodash";
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

  const tableInfo=useSelector((state)=>getTableInfo(state));
  const handleClose = () => props.setOpen(false);
  const [fieldData, setFieldData] = useState("");
  const [filterName, setFilterName] = useState('');
  const [query,setQuery]=useState([{
    "andor":"",
    "fields": "",
    "selectedOption":"",
    "value":""
  }])
  const handleChangeSelectedOption = (event,index) => {
    var temp  = query;
    temp[index].selectedOption = event.target.value;
 
    setQuery([...temp]);
  };
  useEffect(()=>{

    tableData();
  },[])
  const handleChangeField = (event,index) => {
    var temp  = query;
    temp[index].fields = event.target.value;
    setQuery([...temp]);
   
  };
  const handleChangeValue = (event,index) => {
    var temp  = query;
    temp[index].value = event.target.value;
    setQuery([...temp]);
   
  };

  const handleRemove = (index) => {
    const newData = [...query];
    newData.splice(index, 1);
    setQuery([...newData])
  }
  const handleChangeAndOr = (event,index) => {
    var temp  = query;
    temp[index].andor = event.target.value;
    setQuery([...temp]);
  };

  const handleAddInput = () => {
    setQuery([...query,{"andor":"",
    "fields": "",
    "selectedOption":"",
    "value":""}])
  };
  
  const tableData = async () => {
    
    var columns = cloneDeep( tableInfo.columns)
    columns = columns?.length>2 ? columns?.splice(1,columns?.length-2):[]
    setFieldData(columns)
  }

  const getQueryData = async () => {
    let queryToSend = "select * from " + props?.tableName + " where ";
    for(var i =0;i<query?.length;i++)
    {
        switch (query[i]?.andor) {
          case "and":
            queryToSend =queryToSend +" and "
          break;
          case "or":
            queryToSend =queryToSend +" or "
            break;
          
        }

        queryToSend +=   query[i].fields  + " " 
        if (query[i].selectedOption == "LIKE" || query[i].selectedOption == "NOT LIKE") {
          queryToSend += " " + query[i].selectedOption + " '%" +  query[i].value + "%'"
        }
        if (query[i].selectedOption == "and" || query[i].selectedOption == "or") {
          queryToSend +=  query[i].selectedOption + " '" + query[i].value + "'"
        }
        if(query[i].selectedOption == "=" || query[i].selectedOption == "!="){
          queryToSend +=  query[i].selectedOption + " '" + query[i].value + "'"
        }
    }
    
    const dataa = {
      filterName: filterName,
      query: queryToSend
    }
     await createFilter(props?.dbId, props?.tableName, dataa)
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

    
        { query.map((q,index)=>(<Box key={index} style={{ display: "flex", flexDirection: "row" }}>
            {index==0 && <Box><Button style={{ padding: "14%" }}>WHERE</Button></Box>}
            
           {index!=0  && <Box>
              <Select onChange={(e)=>handleChangeAndOr(e,index)}>
                    <MenuItem value="and">and</MenuItem>
                    <MenuItem value="or">or</MenuItem>
                  </Select>
            </Box>}
            <Box>
              {console.log(fieldData)}
              <Select onChange={(e)=>handleChangeField(e,index)} >
                {fieldData && Object.entries(fieldData)?.map((fields, index) => (
                  <MenuItem key={index} value={fields[1]?.id} >
                  {fields[1].label}
                </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
           
              <Select onChange={(e)=>handleChangeSelectedOption(e,index)} >
                <MenuItem value="LIKE">contains</MenuItem>
                <MenuItem value="NOT LIKE">does not contain</MenuItem>
                <MenuItem value="=">is</MenuItem>
                <MenuItem value="!=">is not</MenuItem>
              </Select>
            </Box>

            <Box>
            
                <TextField sx={{ width: 150, height: 60, fontWeight: 'bold' }} placeholder="Enter the value" type="text" onChange={(e) => handleChangeValue(e,index)} />
            </Box>
           {index>=1 && <Button onClick={()=>{
              handleRemove(index)
            }}>Remove</Button>}
          </Box>))}
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
