import React, {  useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField, Button,ClickAwayListener } from "@mui/material"; 
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

import { createFilter } from "../api/filterApi";
import { useDispatch } from "react-redux";
import { setAllTablesData } from "../store/allTable/allTableSlice";
import variables from '../assets/styling.scss';


const FilterModal = (props) => {
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState("");
  const dispatch = useDispatch();
  const calculatePosition = () => {
    const buttonRect = props?.buttonRef.current.getBoundingClientRect();
    const { scrollX, scrollY } = window;
    const { innerWidth, innerHeight } = window;
  
    // Calculate the initial position below the button
    let top = buttonRect.top + buttonRect.height + scrollY;
    let left = buttonRect.left + scrollX;
  
    // Check if there is enough space below the button
    const popupHeight = 300; // Assuming the popup height is 300px
    const popupWidth = 300; // Assuming the popup width is 300px
  
    if (top + popupHeight > innerHeight) {
      // Not enough space below, position above the button instead
      top = buttonRect.top - popupHeight + scrollY;
    }
  
    // Check if there is enough space on the right
    if (left + popupWidth > innerWidth) {
      // Not enough space on the right, align with the right edge of the button
      left = buttonRect.right - popupWidth + scrollX;
    }
  
    return { top, left };
  };
  
const style = {
  position: "absolute",
  ...calculatePosition(),
  transform: "translate(-0%, -20%)",
  backgroundColor: "#fff",
  zIndex:'10000',
  borderRadius: "0px",
  // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  border:`1px solid ${variables.basictextcolor}`,
  width: "300px",
};


  const handleClose = () => {
    props.setOpen(false);
  };

  // const updateFilter = async () => {
  //   let queryToSend = " ";
  //   if (
  //     props?.dbData?.db?.tables[props?.tableName]?.view &&
  //     Object.values(props?.dbData?.db?.tables[props?.tableName]?.view?.fields).length >= 1
  //   ) {
  //     const viewId = props?.dbData?.db?.tables[props?.tableName]?.view?.id;
  //     queryToSend = "select * from " + viewId;
  //   } else {
  //     queryToSend = "select * from " + props?.tableName;
  //   }
  //   return queryToSend;
  // };
  const handleClickAway = () => {
    handleClose();
  };

  const handleCreateFilter = async () => {
    const firstChar = filterName[0];
let filterName1;
  if (/[a-zA-Z]/.test(firstChar)) {
filterName1=firstChar.toUpperCase() + filterName.slice(1);
  }
  else 
  {
    filterName1=firstChar.toLowerCase() + filterName.slice(1);
  }
  setFilterName(filterName1);

    const dataa = {
      filterName: filterName1,
      query: "SELECT * FROM " + props?.tableName,
      htmlToShow : ""
    };
    const filter = await createFilter(props?.dbId, props?.tableName, dataa);
    const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
    const filterKey = Object.keys(filters).find(key => filters[key].filterName === filterName1);
    await dispatch(setAllTablesData(
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

  // const editQueryData = async () => {
  //  const data = await updateFilter();
  //   const dataa = {
  //     filterId: props?.filterId,
  //     filterName: filterName,
  //     query: data
  //   }
  //   const updatedFilter = await updateQuery(props?.dbId, props?.tableName, dataa)
  //   dispatch(setAllTablesData(
  //     {
  //       "dbId": props?.dbId,
  //       "tables": updatedFilter.data.data.tables , 
  //       "orgId" :  updatedFilter.data.data.org_id
  //     }
  //   ))
  // }

  
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
    <Box sx={style}>
    <div className="popupheader"  style={{marginBottom:'5%'}}>    <Typography sx={{ml:2}}id="title" variant="h6" component="h2">
            create filter
          </Typography><CloseIcon sx={{'&:hover': { cursor: 'pointer' }}} onClick={handleClose}/></div>

      <Box 
          sx={{ml:2,display:'flex',justifyContent:'left'}}
      >
        <TextField
          label="Filter Name"
          variant="outlined"
          value={filterName}
          autoFocus={true}
          onKeyDown={(e)=>{
            if(e.key!='Enter') return;
            if(!filterName) return;
            handleCreateFilter();
            handleClose();

          }}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </Box>
      <Box sx={{m:2}} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          className="mui-button"
          onClick={() => {
            handleCreateFilter();
            handleClose();
          }}
          disabled={!filterName}
          style={{ marginRight: "10px" }}
          sx={{fontSize:`${variables.editfilterbutttonsfontsize}`}}
        >
          Create Filter
        </Button>
       
      </Box>
    </Box>
    </ClickAwayListener>

  );
};

FilterModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dbId: PropTypes.any,
  tableName: PropTypes.any,
  filterId: PropTypes.any,
  dbData: PropTypes.any,
  setUnderLine: PropTypes.any,
  buttonRef:PropTypes.any
};

export default FilterModal;

