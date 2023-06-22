import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Joi from "joi"
// import CustomAutoSuggest from "./customAutoSuggest/customAutoSuggest";
import { useValidator } from "react-joi"
import {  TextField } from '@mui/material';
import {  updateQuery } from "../api/filterApi"
import { getAllTableInfo } from "../store/allTable/allTableSelector";
import { useDispatch, useSelector } from "react-redux";
import { setAllTablesData } from "../store/allTable/allTableSlice";
// import { useNavigate } from "react-router-dom";
import CustomAutoSuggest from "./customAutoSuggest/customAutoSuggest";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};



export default function AddFilterPopup(props) {
  // const navigate = useNavigate();
  const AllTableInfo = useSelector((state) => getAllTableInfo(state));
  const handleClose = () => {
    props?.setEdit(false)
    props.setOpen(false);
  }

  const [filterName, setFilterName] = useState('');
  const [html, setHtml] = useState('');
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const [query, setQuery] = useState("")
  const [fields, setFields] = useState([]);
  const [defaultValue,setDefaultValue]=useState(AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.htmlToShow || "");
  const tableData = async () => {
    const myObj =AllTableInfo?.tables[props?.tableName]?.fields;
    const arr = Object.keys(myObj).map((key) => ({
      name: myObj[key].fieldName,
      content: key,
    }));
    setFields(arr);
  };

  useEffect(() => {
    tableData();
  }, [props.tableName]);
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


  useEffect(() => {
    console.log("inuseffect")
    if (props?.edit == true) {
      const editDataValues = AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.query;
      const htmlToShow=AllTableInfo?.tables[props?.tableName]?.filters[props?.filterId]?.htmlToShow;
      setDefaultValue(htmlToShow);
      const searchString = "where";
      let valueAfterWhere = ""
      if(editDataValues.includes(searchString)){
        const index = editDataValues.indexOf(searchString); 
        if (index !== -1) {
         valueAfterWhere = editDataValues.substring(index + searchString.length).trim();
        console.log(valueAfterWhere);
        setQuery(valueAfterWhere)
      }
      } else{
        setQuery("")
      }     
      setFilterName(AllTableInfo.tables[props?.tableName].filters[props?.filterId].filterName)
      
    }
    // tableData();
  }, [props])


  const updateFilter =async()=>{
    var queryToSend = " ";
    console.log(query,"qwury")
    if (props?.dbData?.db?.tables[props?.tableName]?.view &&
      Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields).length >= 1) {
      const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id
      queryToSend = "select * from " + viewId + " where "+ text.trim();
    } else {
      queryToSend = "select * from " + props?.tableName + " where "+ text.trim();
    }
    return queryToSend;
  }

  
  
  // const getQueryData = async () => {
  //  const data =  await updateFilter();
  //   let dataa = {
  //     filterName: filterName,
  //     query: data,
  //     htmlToShow:html || ""

      
  //   }
  //   // console.log(query,"filterdata")
  //   const filter = await createFilter(props?.dbId, props?.tableName, dataa)
  //   const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
  //   const filterKey = Object.keys(filters).find(key => filters[key].filterName === filterName);
  //     dispatch(setAllTablesData(
  //     {
  //       "dbId": props?.dbId,
  //       "tables": filter.data.data.data.tables
  //     }
  //   ))
  //   props?.setUnderLine(filterKey)
  //   navigate(`/db/${props?.dbId}/table/${props?.tableName}/filter/${filterKey}`);
  //   return dataa;
  // }

  const editQueryData = async () => {
   const data = await updateFilter();
   console.log(data,"wuerydaya")
    const dataa = {
      filterId: props?.filterId,
      filterName: filterName,
      query: data,
      htmlToShow:html
    }
    const updatedFilter = await updateQuery(props?.dbId, props?.tableName, dataa)
    dispatch(setAllTablesData(
      {
        "dbId": props?.dbId,
        "tables": updatedFilter.data.data.tables
      }
    ))
  }
  const handleTextChange = (text, html) => {
    setText(text.trim());
    setHtml(html);
    setText(text);
  };
  
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
              Update View
            </Typography>
          </Box>

          <Box style={{ display: "flex", flexDirection: "column" }}>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
            <Typography sx={{ mt: 2, mr: 1, color: 'blue' }}>FILTER NAME</Typography>
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

            <Box sx={{display:'flex',flexDirection:'row',mb:2}}><Typography sx={{ mt: 2, mr: 1, color: 'blue' }}>WHERE</Typography>
        {/* <TextField value={query} onChange={(e)=>{setQuery(e.target.value)}} placeholder="Enter the conditions"></TextField> */}
        <div style={{marginLeft:'7.5%',paddingRight:'1%'}}>
        <CustomAutoSuggest
          getInputValueWithContext={handleTextChange}
          width="400px"
          suggestion={fields}
          setHtml={setHtml}
          setText={setText}
          defaultValue={defaultValue}
        />
        </div>
</Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          
            <Box>
              {props?.edit == true && <Button className="mui-button" onClick={() => {
                editQueryData()
                handleClose()
              }} variant="contained">Edit</Button>}
            </Box>

            <Box>
              <Button variant="outlined" className="mui-button-outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>

          </Box>
        </Box>

      </Modal>
    </Box>
  );
}

AddFilterPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any,
  edit: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  setEdit: PropTypes.func,
  setUnderLine:PropTypes.any
};

