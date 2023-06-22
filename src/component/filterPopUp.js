import React, {  useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField, Button } from "@mui/material"; 
import { useNavigate } from "react-router-dom";
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
  padding: "20px",
  width: "250px",
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

  const handleCreateFilter = async () => {
    // const data = await updateFilter();
    const dataa = {
      filterName: filterName,
      query: "SELECT * FROM " + props?.tableName,
      htmlToShow : ""
    };
    const filter = await createFilter(props?.dbId, props?.tableName, dataa);
    console.log(filter,"filterdata")
    const filters = filter?.data?.data?.data?.tables[props?.tableName]?.filters;
    const filterKey = Object.keys(filters).find(
      (key) => filters[key].filterName === filterName
    );
    dispatch(
      setAllTablesData({
        dbId: props?.dbId,
        tables: filter.data.data.data.tables,
      })
    );
    props?.setUnderLine(filterKey);
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
    <Box sx={style}>
      <Typography sx={{mt:-1,mb:1}}variant="h5">
        Create Filter
      </Typography>
      <Box>
        <TextField
          label="Filter Name"
          variant="outlined"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </Box>
      <Box sx={{mt:2}} display="flex" justifyContent="center">
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
        <Button
          variant="outlined"
          onClick={handleClose}
          className='mui-button-outlined'
          sx={{fontSize:`${variables.editfilterbutttonsfontsize}`}}
        >
          Cancel
        </Button>
      </Box>
    </Box>
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
  buttonRef:PropTypes.any
};

export default FilterModal;

