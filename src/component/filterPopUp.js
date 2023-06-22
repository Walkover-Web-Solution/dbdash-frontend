import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography, TextField, Button } from "@material-ui/core";
// import AddIcon from "@material-ui/icons/Add";
import { useNavigate } from "react-router-dom";
import { createFilter } from "../api/filterApi";
import { useDispatch} from "react-redux";
import { setAllTablesData } from "../store/allTable/allTableSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300, // Reduced the width to make the popup smaller
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2, // Reduced the padding to make the content area smaller
};

const FilterModal = (props) => {
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleChangeSelectedOption = (event, index) => {
    var temp = query;
    temp[index].selectedOption = event.target.value;

    setQuery([...temp]);
  };
  
  useEffect(() => {
    if (props?.edit == true && props?.filterId) {
      const editDataValues = AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.query
      setFilterName(AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.filterName)
      const whereIndex = editDataValues?.indexOf("where");
      const whereClause = editDataValues?.substring(whereIndex + 5);
      if (whereClause?.includes('and') || whereClause?.includes('or')) {
        var conditions = whereClause?.split(/\s+(or|and)\s+/i)
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
              valuee = pqrs[pqrs.length - 1];
              if (valuee.indexOf('%') !== -1) {
                valuee = valuee.substring(1, valuee.length - 1);
              }
          }
          
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
    // columns = columns?.length > 2 ? columns?.splice(1, columns?.length - 2) : []
    setFieldData(columns)
  }

  const updateFilter =async()=>{

    var queryToSend = " ";
    if (
      props?.dbData?.db?.tables[props?.tableName]?.view &&
      Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields)
        .length >= 1
    ) {
      const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id;
      queryToSend = "select * from " + viewId;
    } else {
      queryToSend = "select * from " + props?.tableName;
    }
    return queryToSend;
  };

  const handleCreateFilter = async () => {
    const data = await updateFilter();
    const dataa = {
      filterName: filterName,
      query: data
    }
    const filter = await createFilter(props?.dbId, props?.tableName, dataa)
    const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
    const filterKey = Object.keys(filters).find(key => filters[key].filterName === filterName);
    dispatch(setAllTablesData(
      {
        "dbId": props?.dbId,
        "tables": filter.data.data.data.tables,
        "orgId" : filter.data.data.data.org_id
      }
    ))
    // dispatch(bulkAddColumns(
    //   {
    //     "dbId": props?.dbId,
    //     "filter":data,
    //     "pageNo":1,
    //     "tableName": props?.tableName,
    //     "tables": props?.dbData?.db?.tables
        
    //   }
    // ))
    props?.setUnderLine(filterKey)
    navigate(`/db/${props?.dbId}/table/${props?.tableName}/filter/${filterKey}`);
    return dataa;
  };

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
        "tables": updatedFilter.data.data.tables , 
        "orgId" :  updatedFilter.data.data.org_id
      }
    ))
  }

  
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Filter
        </Typography>
        <Box>
          <TextField
            fullWidth
            label="Filter Name"
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              handleCreateFilter();
              handleClose();
            }}
            disabled={!filterName}
          >
            Create Filter
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

FilterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any,
  edit: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  setEdit: PropTypes.func,
  setUnderLine: PropTypes.any,
};

export default FilterModal;
