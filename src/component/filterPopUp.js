import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Joi from "joi"
import { useValidator } from "react-joi"
import { Select, MenuItem, TextField } from '@mui/material';
import { createFilter, updateQuery } from "../api/filterApi"
import { getTableInfo } from "../store/table/tableSelector";
import { getAllTableInfo } from "../store/allTable/allTableSelector";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import AddIcon from '@mui/icons-material/Add';
import { setAllTablesData } from "../store/allTable/allTableSlice";
import { bulkAddColumns } from "../store/table/tableThunk";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const addBtnStyle = {
  color: "white",
  bgcolor: "#1976d2"
}

export default function FilterModal(props) {

  const tableInfo = useSelector((state) => getTableInfo(state));
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const handleClose = () => {
    props?.setEdit(false)
    props.setOpen(false);
  }

  const [fieldData, setFieldData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [lastValue, setLastValue] = useState("");
  const dispatch = useDispatch();

  const [query, setQuery] = useState([{
    "andor": "",
    "fields": fieldData[0]?.id,
    "selectedOption": "LIKE",
    "value": ""
  }])
  useEffect(()=>{
   if(fieldData.length){
    query[0].fields = query[0]?.fields ? query[0].fields : fieldData[0]?.id,
    setQuery(query)
   }
  },[fieldData])
  const { state, setData, setExplicitField, validate } = useValidator({

    initialData: {
      filterName: null,
    },
    schema: Joi.object({
      filterName: Joi.string().min(1).required(),
    }),
    explicitCheck: {
      filterName: false,
    },
    validationOptions: {
      abortEarly: true,
    },
  })

  const createFilterJoi = (e) => {

    e.persist();
    const value = e.target.value;
    setFilterName(value);

    setData((old) => ({
      ...old,
      filterName: value,
    }));
    validate();
  };

  const handleChangeSelectedOption = (event, index) => {
    var temp = query;
    temp[index].selectedOption = event.target.value;

    setQuery([...temp]);
  };
  
  useEffect(() => {
    if (props?.edit == true) {
      const editDataValues = AllTableInfo.tables[props?.tableName].filters[props?.filterId].query
      setFilterName(AllTableInfo.tables[props?.tableName].filters[props?.filterId].filterName)
      const whereIndex = editDataValues.indexOf("where");
      const whereClause = editDataValues.substring(whereIndex + 5);
      if (whereClause.includes('and') || whereClause.includes('or')) {
        var conditions = whereClause.split(/\s+(or|and)\s+/i)
      }
      else {
        conditions = whereClause
      }
      var finalQuery = [];
      if (typeof (conditions) != "object") {
        var temp = conditions;
        conditions = [];
        conditions.push(temp)
      }
      for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] == 'or' || conditions[i] == 'and') {
          let json = {}
          let valuee = ""
          json.andor = conditions[i];
          const pqrs = conditions[i + 1].split(/\s+/);
          if(pqrs[0].startsWith("CAST")){
            json.fields = pqrs[0].substring(5);
            json.selectedOption = pqrs[3] == "NOT" ? "NOT LIKE" :pqrs[3];
            valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
            if (valuee.indexOf('%') !== -1) {
              valuee = valuee.substring(1, valuee.length - 1);
            }
          }
          else{

            json.fields = pqrs[0];
              json.selectedOption = (pqrs[1] == "NOT" ? "NOT LIKE" : pqrs[1])
              valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
              if (valuee.indexOf('%') !== -1) {
                valuee = valuee.substring(1, valuee.length - 1);
              }
          }

          // json.fields = pqrs[0]
          // json.selectedOption = pqrs[1] == "NOT" ? pqrs[1] + " " + pqrs[2] : pqrs[1]
          // let valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
          // if (valuee.indexOf('%') !== -1) {
          //   valuee = valuee.substring(1, valuee.length - 1);
          // }
          json.value = valuee
          finalQuery.push(json)
          i++;
        }
        else {
          let json = {};
          json.andor = "";
          let valuee=""
          const pqrs = conditions[0].trim().split(/\s+/);
          if(pqrs[0].startsWith("CAST")){
            json.fields = pqrs[0].substring(5);
            json.selectedOption = pqrs[3] == "NOT" ? "NOT LIKE" :pqrs[3];
            valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
            if (valuee.indexOf('%') !== -1) {
              valuee = valuee.substring(1, valuee.length - 1);
            }
          }
          else{
            json.fields = pqrs[0];
              json.selectedOption = (pqrs[1] == "NOT" ? "NOT LIKE" : pqrs[1])
              valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
              if (valuee.indexOf('%') !== -1) {
                valuee = valuee.substring(1, valuee.length - 1);
              }
          }
          // for (let i = 0; i < conditions.length; i++) {
          //   if (conditions[i].includes("CAST")) {
          //     console.log("consition",conditions)
          //     json.fields = pqrs[0].substring(5);
          //     json.selectedOption = pqrs[3] == "NOT" ? "NOT LIKE" :pqrs[3];
          //     valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
          //     if (valuee.indexOf('%') !== -1) {
          //       valuee = valuee.substring(1, valuee.length - 1);
          //     }
          //     console.log(json.fields,json.selectedOption,valuee)
          //   }
          // } 
          // let doesNotContainCast = true;
          // for (let i = 0; i < conditions.length; i++) {
          //   if (conditions[i].includes("CAST")) {   
          //     doesNotContainCast = false;
          //     break;   
          //   }}    
          //   if(doesNotContainCast != false){
          //     console.log("1")
          //     json.fields = pqrs[0];
          //     json.selectedOption = (pqrs[1] == "NOT" ? "NOT LIKE" : pqrs[1])
          //     valuee = pqrs[pqrs.length - 1].substring(1, pqrs[pqrs.length - 1].length - 1);
          //     if (valuee.indexOf('%') !== -1) {
          //       valuee = valuee.substring(1, valuee.length - 1);
          //     }
          //   }         
          json.value = valuee
          finalQuery.push(json)
        }

      }
      setQuery(finalQuery)
    }
    tableData();
  }, [props])
  const handleChangeField = (event, index) => {
    var temp = query;
    temp[index].fields = event.target.value;
    setQuery([...temp]);

  };
  const handleChangeValue = (event, index) => {
    var temp = query;
    temp[index].value = event.target.value;
    setQuery([...temp]);
    setLastValue(event.target.value);
  };

  const handleRemove = (index) => {
    const newData = [...query];
    newData.splice(index, 1);
    setQuery([...newData])
  }
  const handleChangeAndOr = (event, index) => {
    var temp = query;
    temp[index].andor = event.target.value;
    setQuery([...temp]);
  };

  const handleAddInput = () => {
    setQuery([...query, {
      "andor": "and",
      "fields": fieldData[0]?.id,
      "selectedOption": "LIKE",
      "value": ""
    }])
  };

  const tableData = async () => {
    var columns = cloneDeep(tableInfo.columns)
    columns = columns?.length > 2 ? columns?.splice(1, columns?.length - 2) : []
    setFieldData(columns)
  }

  const updateFilter =async()=>{

    var queryToSend = " ";
    if (props?.dbData?.db?.tables[props?.tableName]?.view &&
      Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields).length >= 1) {
      const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id
      queryToSend = "select * from " + viewId + " where ";
    } else {
      queryToSend = "select * from " + props?.tableName + " where ";
    }
    for (var i = 0; i < query?.length; i++) {
      switch (query[i]?.andor) {
        case "and":
          queryToSend = queryToSend + " and "
          break;
        case "or":
          queryToSend = queryToSend + " or "     
          break;
      }
      var FieldDataType = ""
     
        for (let j = 0; j < tableInfo?.columns.length; j++) {
          if (query[i]?.fields == tableInfo?.columns[j]?.id) {
            FieldDataType = tableInfo.columns[j]?.dataType
          }
        }

      if (FieldDataType == "createdat" || FieldDataType == "createdby") {
        queryToSend += FieldDataType + " "
      }
      else if(query[i].selectedOption == "=" || query[i].selectedOption == "!="){  
          queryToSend += query[i].fields + " "
      }
      else if(FieldDataType == "numeric")
      {
        queryToSend += "CAST" + "(" + query[i].fields + " as " +  "CHAR)" + " "
      }
      else {
        queryToSend += query[i].fields + " "
      }

      if (query[i].selectedOption == "LIKE" || query[i].selectedOption == "NOT LIKE") {    
          queryToSend += " " + query[i].selectedOption + " '%" + query[i].value + "%'"
      }
      if (query[i].selectedOption == "and" || query[i].selectedOption == "or") {
        if (FieldDataType == "numeric") {
          queryToSend += query[i].selectedOption + " " + query[i].value 
        } else {
          queryToSend += query[i].selectedOption + " '" + query[i].value + "'"
        }
      }
      if (query[i].selectedOption == "=" || query[i].selectedOption == "!=") {
        if (FieldDataType == "numeric") {
          queryToSend += query[i].selectedOption + " " + query[i].value 
        } else {
          queryToSend += query[i].selectedOption + " '" + query[i].value + "'"
        }
      }
    }
    return queryToSend;
  }
  const getQueryData = async () => {
   const data =  await updateFilter();
    const dataa = {
      filterName: filterName,
      query: data
    }
    const filter = await createFilter(props?.dbId, props?.tableName, dataa)
    dispatch(setAllTablesData(
      {
        "dbId": props?.dbId,
        "tables": filter.data.data.data.tables
      }
    ))
    dispatch(bulkAddColumns(
      {
        "dbId": props?.dbId,
        "filter":data,
        "pageNo":1,
        "tableName": props?.tableName
      }
    ))
    return dataa;
  }

  const editQueryData = async () => {
   const data = await updateFilter();
    const dataa = {
      filterId: props?.filterId,
      filterName: filterName,
      query: data
    }
    const updatedFilter = await updateQuery(props?.dbId, props?.tableName, dataa)
    dispatch(setAllTablesData(
      {
        "dbId": props?.dbId,
        "tables": updatedFilter.data.data.tables
      }
    ))
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

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography id="title" variant="h6" component="h2" fontWeight="bold" fontSize={26}>
              Create Filter
            </Typography>
          </Box>

          <Box style={{ display: "flex", flexDirection: "column" }}>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TextField error={
                state?.$errors?.filterName.length === 0
                  ? false
                  : state.$errors?.filterName
                    ? true
                    : false
              } autoFocus sx={{ width: 150, height: 60, fontWeight: 'bold' }} value={filterName} type="text" placeholder="enter filter name" onChange={(e) => { setFilterName(e.target.value); createFilterJoi(e); }} onBlur={() => setExplicitField("filterName", true)} />
            </Box>
            <div style={{ color: "red", fontSize: "12px", paddingLeft: "172px" }}>
              {state.$errors?.filterName?.map((data) => data.$message).join(",")}
            </div>

            <Box>
              {query.map((q, index) => (<Box key={index} sx={{ display: "flex", flexDirection: "row" }}>
                {index == 0 && <Box><Typography sx={{ mt: 2, mr: 1, color: 'blue' }}>WHERE</Typography></Box>}

                {index != 0 && <Box>
                  <Select value={q?.andor || "and"}
                    onChange={(e) => handleChangeAndOr(e, index)}>
                    <MenuItem value="and">and</MenuItem>
                    <MenuItem value="or">or</MenuItem>
                  </Select>
                </Box>}

                <Box sx={{ mr: 1 }}>
                  <Select value={q?.fields || fieldData[0]?.id} onChange={(e) => handleChangeField(e, index)} sx={{ width: 150 }}>
                    {fieldData && Object.entries(fieldData)?.map((fields, index) => (
                      <MenuItem key={index} value={fields[1]?.id} >
                        {fields[1].label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Select sx={{ width: 150 }}
                    value={q?.selectedOption || "LIKE"}
                    // defaultValue="LIKE"
                    key={q?.value}
                    onChange={(e) => handleChangeSelectedOption(e, index)} >
                    <MenuItem value="LIKE">contains</MenuItem>
                    <MenuItem value="NOT LIKE">does not contain</MenuItem>
                    <MenuItem value="=">is</MenuItem>
                    <MenuItem value="!=">is not</MenuItem>
                  </Select>
                </Box>

                <Box>

                  <TextField required value={q?.value} sx={{ width: 150, height: 60, fontWeight: 'bold', }} placeholder="Enter the value" type="text" onChange={(e) => handleChangeValue(e, index)} />

                  {query[query.length - 1].value.length === 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>Value cannot be empty</div>
                  )}
                </Box>
                {index >= 1 && <Button onClick={() => {
                  handleRemove(index)
                }}>Remove</Button>}
              </Box>))}
            </Box>

            <Box sx={{ mb: 2, ml: 1 }}>
              <Button onClick={handleAddInput}> <AddIcon sx={addBtnStyle} /> </Button>
            </Box>

          </Box>


          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props?.edit == false && <Box>
              <Button variant="contained" disabled={filterName.length < 1 || filterName.length > 15 || lastValue.length === 0} onClick={() => {
                validate();
                getQueryData();
                handleClose();
              }}>
                Create
              </Button>
            </Box>}

            <Box>
              {props?.edit == true && <Button onClick={() => {
                editQueryData()
                handleClose()
              }} variant="contained">Edit</Button>}
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
  edit: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  setEdit: PropTypes.func
};