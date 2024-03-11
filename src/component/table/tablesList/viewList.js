import React, { useState, useRef, memo, useMemo } from "react";
import { Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import FilterModal from "../../filterPopup/filterPopUp";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { bulkAddColumns, filterData } from "../../../store/table/tableThunk";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteFilter } from "../../../api/filterApi";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import { exportCSV } from "../../../api/tableApi";
import "./tablesAndViews.scss";
import variables from "../../../assets/styling.scss";
import { toast } from "react-toastify";
import   {  customUseSelector }  from "../../../store/customUseSelector";


 function ViewList({ dbData, filterId, setFilterId, anchorEl, setAnchorEl, setShareLinkOpen }) {
  const AllTableInfo = customUseSelector((state) => state.tables.tables);
  const dispatch = useDispatch();
  const params = useParams();

  const navigate = useNavigate();
  const [openn, setOpenn] = useState(false);
  const handleOpenn = () => setOpenn(true);
  const [edit, setEdit] = useState(false);
  const buttonRef = useRef(null);
  
    const fullName=customUseSelector((state) => state.user.userFirstName+" "+state.user.userLastName);
   const email=customUseSelector((state) => state.user.userEmail)
  
  const handleClick = (event, id) => {
    if (id === "share") {
      setShareLinkOpen(true);
    } else {
      setFilterId(id);
      setAnchorEl(event.currentTarget);
    }
  };
  const dispatchFilterData = ()=>{

    if (!params?.filterName) return null;
      dispatch(
        filterData({
          filterId: params?.filterName,
          tableId: params?.tableName,
          filter:
            AllTableInfo[params?.tableName]?.filters[params?.filterName]?.query,
          dbId: dbData?.db?._id,
        })
      );
      return params?.filterName;
  }
  const underLine=useMemo(dispatchFilterData,[params?.filterName])
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  function onFilterClicked(filter, id) {
   
    setFilterId(params?.filterName || id);
    if (params?.filterName == id) {
      dispatch(
        filterData({
          filterId: id,
          tableId: params?.tableName,
          filter: filter,
          dbId: dbData?.db?._id,
        })
      );
    }

    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}/filter/${id}`);
  }
  const deleteFilterInDb = async () => {
    const data = {
      filterId: filterId,
    };
    const deletedFilter = await deleteFilter(
      dbData?.db?._id,
      params?.tableName,
      data
    );
    dispatch(
      setAllTablesData({
        dbId: dbData?.db?._id,
        tables: deletedFilter.data.data.tables,
        orgId: deletedFilter.data.data.org_id,
      })
    );
    dispatch(
      bulkAddColumns({
        dbId: dbData?.db?._id,
        tableName: params?.tableName,
        org_id: dbData?.db?.org_id,
        pageNo: 1
      })
    );
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}`);
  };
 
  const handleAddView = async()=>{
    handleOpenn();
    setEdit(false);
  }

  const exportCSVTable = async () => {
    const query = AllTableInfo?.[params?.tableName].filters?.[filterId].query;
    const data = {
      query: query,
      userName: fullName,
      email: email,
      filterId: filterId,
    };
    await exportCSV(dbData?.db?._id, params?.tableName, data);
    toast.success("Your CSV file has been mailed successfully");
  };
  return (
    <>
        <Box className="tableList-add-view">
          <div className="tableList-div-1">
            <div
              className="tableList-div-2"
             
            >
              {AllTableInfo[params?.tableName]?.filters &&
                Object.entries(AllTableInfo[params?.tableName]?.filters).map(
                  (filter, index) => (
                    <Box key={index} className="custom-box">
                      <Box
                        className="filter-box"
                        onClick={() => {
                          onFilterClicked(
                            filter[1].query,
                            filter[0],
                            filter[1]
                          );
                        }}
                        sx={{
                          backgroundColor:
                            underLine === filter[0]
                              ? variables.highlightedfilterboxcolor
                              : variables.filterboxcolor,
                             
                        }}
                        variant="outlined"
                      >
                        <div
                          className="tableList-div-3"
                         
                        >
                          {filter[1]?.filterName.length > 10
                            ? `${filter[1]?.filterName.slice(0, 6)}...`
                            : filter[1]?.filterName}
                        </div>
                                            <IconButton onClick={(e) =>{
                                              e.stopPropagation();
                                              handleClick(e, filter[0])}}>
                          <MoreVertIcon className="moreverticon" />
                        </IconButton>
                        

                      </Box>
                    </Box>
                  )
                )}
            </div>
          </div>
          <Button
            // onClick={() => handleOpenn()}
            onClick={()=>{handleAddView()}}
            variant="outlined"
            ref={buttonRef}
            className="mui-button-outlined filter-button custom-button-add-view"
          >
            Add View
          </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
          <MenuItem
            onClick={() => {
              exportCSVTable();
              handleClose();
            }}
          >
            Export CSV
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteFilterInDb();
              handleClose();
            }}
            className="delete-color"
           
          >
            Delete
          </MenuItem>
        </Menu>
        {openn && !edit && (
          <FilterModal
            dbData={dbData}
            buttonRef={buttonRef}
            open={openn}
            edit={edit}
            setEdit={setEdit}
            setOpen={setOpenn}
            filterId={filterId}
            dbId={dbData?.db?._id}
            tableName={params?.tableName}
          />
        )}
    </>
  );
}
export default memo(ViewList);
ViewList.propTypes = {
  dbData: PropTypes.any,
  filterId : PropTypes.any, 
  setFilterId : PropTypes.func, 
  anchorEl : PropTypes.any, 
  setAnchorEl : PropTypes.func, 
  setShareLinkOpen : PropTypes.func
};