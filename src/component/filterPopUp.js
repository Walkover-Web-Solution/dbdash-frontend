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
import { getAllTableInfo } from "../store/allTable/allTableSelector";
import { useSelector} from "react-redux";
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
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const handleClose = () => props.setOpen(false);
  const [fieldData, setFieldData] = useState("");
  const [filterName, setFilterName] = useState('');
  const [editData,setEditData] = useState("");

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

  console.log("edit query",query)
  // useEffect(()=>{
  //   if(props?.edit == true)
  //   {
  //     console.log(props?.filterId)
  //     setFilterName(AllTableInfo.tables[props?.tableName].filters[props?.filterId].filterName)
  //     setEditData(AllTableInfo.tables[props?.tableName].filters[props?.filterId].query)
  //     // setQueryParts(queryWithoutSelect);
  //     console.log(editData)
      
  //   }
  // })
  useEffect(()=>{   
    if(props?.edit == true)
    {
      setEditData(AllTableInfo.tables[props?.tableName].filters[props?.filterId].query)
      setFilterName(AllTableInfo.tables[props?.tableName].filters[props?.filterId].filterName)
      const whereIndex = editData.indexOf("where"); 
      const whereClause = editData.substring(whereIndex + 5);
      if(whereClause.includes('and') || whereClause.includes('or'))
      {
           var conditions = whereClause.split(/\s+(or|and)\s+/i)
      }
      else{
         conditions = whereClause
      }
      console.log("query condtions = ",conditions)
      console.log(conditions[1])
      var finalQuery = [];
      if(typeof(conditions) != "object")
      {
          var temp = conditions;
          conditions=[];
          conditions.push(temp) 
      }
      for(var i = 0;i <conditions.length;i++)
      {
        if(conditions[i] == 'or' || conditions[i] == 'and')
        {
            let json ={}         
            json.andor = conditions[i];
            const pqrs = conditions[i+1].split(/\s+/);
            console.log("pqrs",pqrs)
            json.fields = pqrs[0]
            json.selectedOption = pqrs[1] == "NOT" ? pqrs[1]+" "+ pqrs[2] : pqrs[1]
            json.value = pqrs[pqrs.length-1].substring(1,pqrs[pqrs.length-1].length-1 );
            finalQuery.push(json)
            i++;
            console.log(query)
        }
        else{
            let json = {};
            json.andor = "";
            const pqrs = conditions[0].trim().split(/\s+/);
            console.log("pqrst",pqrs)
            console.log("pqrst  [0] ",pqrs[0])
            json.fields = pqrs[0];
            json.selectedOption = (pqrs[1] == "NOT" ? "NOT LIKE" : pqrs[1])
            json.value = pqrs[pqrs.length-1].substring(1,pqrs[pqrs.length-1].length-1 );
            console.log("first json",json);
            finalQuery.push(json)
        }
      
      }
      setQuery(finalQuery)
    }
    tableData();
  },[props])
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

              <TextField autoFocus sx={{ width: 150, height: 60, fontWeight: 'bold' }} value={filterName} type="text" placeholder="enter filter name" onChange={(e) => {
                setFilterName(e.target.value)
              }} />

              <Box />
            </Box>
          </Box>

    
        { query.map((q,index)=>(<Box key={index} style={{ display: "flex", flexDirection: "row" }}>
            {index==0 && <Box><Button style={{ padding: "14%" }}>WHERE</Button></Box>}
            
           {index!=0  && <Box>
              <Select value={q?.andor}
                onChange={(e)=>handleChangeAndOr(e,index)}>
                    <MenuItem value="and">and</MenuItem>
                    <MenuItem value="or">or</MenuItem>
                  </Select>
            </Box>}
            <Box>
              <Select value ={q?.fields} onChange={(e)=>handleChangeField(e,index)} >
                {fieldData && Object.entries(fieldData)?.map((fields, index) => (
                  <MenuItem key={index} value={fields[1]?.id} >
                  {fields[1].label}
                </MenuItem>
                ))}
              </Select>
            </Box>

            <Box>
              <Select 
              value={q?.selectedOption}
              onChange={(e)=>handleChangeSelectedOption(e,index)} >
                <MenuItem value="LIKE">contains</MenuItem>
                <MenuItem value="NOT LIKE">does not contain</MenuItem>
                <MenuItem value="=">is</MenuItem>
                <MenuItem value="!=">is not</MenuItem>
              </Select>
            </Box>

            <Box>
            
            <TextField value={q?.value} sx={{ width: 150, height: 60, fontWeight: 'bold' }} placeholder="Enter the value" type="text" onChange={(e) => handleChangeValue(e,index)} />
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
  tableName: PropTypes.any,
  edit:PropTypes.any,
  filterId:PropTypes.any
};



// var temp = `fldLYxtFB NOT LIKE '%cvxccv%' or fldLYxtFB  NOT LIKE '%cvvcvc%' and fldLYxtFB = 'xcvf'`
// const conditions = temp.split(/\s+(or|and)\s+/i);
// console.log("Welcome to Programiz!",conditions);
// var json1=[]
// for(var i = 0;i <conditions.length;i++)
// {
//     // console.log(conditions[i]);
//     if(conditions[i]=='or'|| conditions[i]=='and')
//     {
//         let json ={}
//         json.andor = conditions[i];
//         var pqrs = conditions[i+1].split(/\s+/);
//         console.log("pqrs",pqrs)
//         json.field = pqrs[0]
//         json.selected = pqrs[1] == "NOT" ? pqrs[1]+pqrs[2] : pqrs[1]
//         json.value = pqrs[pqrs.length-1].substring(1,pqrs[pqrs.length-1].length-1 );
//         json1.push(json);
//         console.log(json);
//       i++;
//     }
//     else{
//           let json ={}
//         json.andor = "";
//         var pqrs = conditions[i].split(/\s+/);
//         json.field = pqrs[0]
//         json.selected = pqrs[1] == "NOT" ? pqrs[1]+pqrs[2] : pqrs[1]
//         json.value = pqrs[pqrs.length-1].substring(1,pqrs[pqrs.length-1].length-1 );
//         json1.push(json);
//     }
   
    
// }
// console.log(json1);