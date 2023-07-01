import React, { useState, useEffect, useRef } from "react";
import ShareLinkPopUp from "../ShareLinkPopUp"
import { Box, Button, Tabs, IconButton, Menu, MenuItem, CircularProgress, } from "@mui/material";
import PopupModal from "../../popupModal";
// import { toast } from 'react-toastify';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import FilterModal from "../../filterPopUp";
import PropTypes from "prop-types";
import SingleTable from "../singleTable/singleTable";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { bulkAddColumns, filterData } from "../../../store/table/tableThunk";
import { useDispatch, useSelector } from "react-redux";
import MainTable from "../../../table/mainTable";
import { createTable1 } from "../../../store/allTable/allTableThunk";
import AddFilterPopup from "../../addFIlterPopup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteFilter } from "../../../api/filterApi";
import { setTableLoading } from "../../../store/table/tableSlice";
import { setAllTablesData } from "../../../store/allTable/allTableSlice";
import { createTable, exportCSV } from "../../../api/tableApi";
import "./tablesList.scss";
import variables from "../../../assets/styling.scss";
import { createViewTable } from "../../../api/viewTableApi";
// import HideFieldDropdown from "../hidefieldDropdown";
import ManageFieldDropDown from "../manageFieldDropDown";
import { toast } from "react-toastify";
import { selectActiveUser } from "../../../store/user/userSelector";
import { getAllTableInfo } from "../../../store/allTable/allTableSelector";
export default function TablesList({ dbData }) {
  const shareViewUrl = process.env.REACT_APP_API_BASE_URL
  const isTableLoading = useSelector((state) => state.table?.isTableLoading);
  const dispatch = useDispatch();
  const params = useParams();
  const AllTableInfo = useSelector((state) => state.tables.tables);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [shareLinkOpen, setShareLinkOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [table, setTable] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenn = () => setOpenn(true);
  const [edit, setEdit] = useState(false);
  const buttonRef = useRef(null);
  const [filterId, setFilterId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const tableLength = Object.keys(AllTableInfo)?.length;
  const [underLine, setUnderLine] = useState(params?.filterName)
  const [currentTable, setcurrentTable] = useState(null)
  const [link, setLink] = useState("Link");
  const [minimap, setMinimap] = useState(false);
  const AllTable = useSelector((state) => getAllTableInfo(state));
  const [openManageField, setOpenManageField] = useState(false);
  const userDetails = useSelector((state) => selectActiveUser(state));
  const handleClick = (event, id) => {
    if (id === "share") {
      setShareLinkOpen(true);
    } else {
      setFilterId(id);
      setcurrentTable(id);
      setAnchorEl(event.currentTarget);
    }
  };
 

  const handleClickOpenManageField = () => {
    setOpenManageField(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
const saveTable = async () => {
  const data = {
    tableName: table,
  };

  setOpen(false);
  const apiCreate = await createTable(dbData?.db?._id, data);
  await dispatch(createTable1({ tables: apiCreate.data.data.tables }));
  const matchedKey = Object.keys(apiCreate?.data?.data?.tables).find(key => {
    return apiCreate?.data?.data?.tables[key].tableName === table;
  });

  if (matchedKey) {
    navigate(`/db/${dbData?.db?._id}/table/${matchedKey}`);
  }
  
  const newTableIndex = Object.keys(AllTableInfo).length;
  setValue(newTableIndex);
};
  const handleEdit = async () => {
    if(params?.filterName){
    
      setOpenn(true);
      setEdit(true);
      // setOpenFilter(true); 
    }else{
      setEdit(false);
      setOpenn(false);
      toast.error("choose the filter First");
    }
  };
  function onFilterClicked(filter, id) {
    setUnderLine(id);
    setFilterId(params?.filterName || id);
    if(params?.filterName == id )
    {
      dispatch(filterData({
        filterId : id,
        tableId: params?.tableName ,
        filter: filter,
        dbId: dbData?.db?._id,
      }))
    }
  
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}/filter/${id}`);
  }
  const deleteFilterInDb = async (filterId) => {
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
        pageNo: 1,
        // fields: dbData?.db?.tables[params?.tableName]?.fields
      })
    );
    navigate(`/db/${dbData?.db?._id}/table/${params?.tableName}`);
  };
useEffect(() => {
  
    const tableNames = Object.keys(dbData.db.tables);
    dispatch(setTableLoading(true));
    if(params?.tableName && !params?.filterName){
     dispatch(
        bulkAddColumns({
          dbId: dbData?.db?._id,
          tableName: params?.tableName || tableNames[0],
          pageNo: 1,
        })
      );
    }
    setValue(tableNames?.indexOf(params?.tableName) !== -1? tableNames?.indexOf(params?.tableName): 0);
    if (!params?.tableName) {
      navigate(`/db/${dbData?.db?._id}/table/${tableNames[0]}`);
    }
}, [params?.tableName]);
  useEffect(()=>{
    if (params?.filterName) {
      setUnderLine(params?.filterName)
      dispatch(filterData({
        filterId : params?.filterName,
        tableId: params?.tableName ,
        filter: AllTableInfo[params?.tableName]?.filters[params?.filterName]?.query,
        dbId: dbData?.db?._id,
      }))
   
    }
    else {
      setUnderLine(null);
    }
  }, [params?.filterName]);

  const shareLink = async () => {
  const isViewExits  = AllTable?.tables?.[params?.tableName]?.filters?.[params?.filterName]?.viewId;
  if(isViewExits)
  {
    setLink(shareViewUrl +`/${isViewExits}`);
    return;
  }
    const db_Id = AllTable.dbId;
    const data = {
      tableId: params?.tableName,
      filterId: params?.filterName,
    };
    const dataa1 = await createViewTable(db_Id, data);
     dispatch( setAllTablesData({
        dbId: dataa1.data.data.dbData._id,
        tables: dataa1.data.data.dbData.tables,
        orgId: dataa1.data.data.dbData.org_id
      }))
    setLink(shareViewUrl+`/${dataa1.data.data.viewId}`);
  };

  const exportCSVTable = async () => {
    const query = AllTableInfo?.[params?.tableName].filters?.[filterId].query;
    const data = {
      query: query,
      userName: userDetails?.fullName,
      email: userDetails?.email,
    };
    await exportCSV(dbData?.db?._id, params?.tableName, data);
    toast.success("Your CSV file has been mailed successfully");
  };
  return (
    <>
      <div className="tableslist">
        <Box className="tables-list-container">
          <Box className="tabs-container">
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              className={`tabs`}
              variant="scrollable"
              scrollButtons={false}
              aria-label="scrollable auto tabs example"
            >
              {AllTableInfo &&
                Object.entries(AllTableInfo).map((table, index) => (
                    <SingleTable
                      table={table}
                      tableLength={tableLength}
                      tabIndex={tabIndex}
                      setTabIndex={setTabIndex}
                      index={index}
                      dbData={dbData}
                      setPage={setPage}
                      key={index}
                    />
                ))}
            </Tabs>
            <Button
              variant="outlined"
              className="mui-button-outlined add-button"
              onClick={() => handleOpen()}
            >
              <AddIcon />
            </Button>
          </Box>
        </Box>
        <Box sx={{paddingLeft:'24px',paddingRight:'20px',display:"flex",justifyContent:'left',flexWrap:'nowrap'}}   >
        <div style={{display:'flex',flexDirection:'row',height:'8vh',overflowY:'hidden'}}>
        <div style={{paddingBottom:'100vh',maxWidth:`${(window.screen.width*88)/100}px`,overflowX:'scroll',overflowY:'hidden',display:'flex',flexDirection:'row'}}>
          {AllTableInfo[params?.tableName]?.filters &&
            Object.entries(AllTableInfo[params?.tableName]?.filters).map(
              (filter, index) => (
                <Box key={index} className="custom-box">
                  <Box
                    className="filter-box"
                    style={{
                      backgroundColor:
                        underLine === filter[0] ? variables.highlightedfilterboxcolor : "transparent",
                    }}
                    variant="outlined"
                  >
                    <div
                      onClick={() => {
                        onFilterClicked(filter[1].query, filter[0], filter[1]);
                      }}
                    >
                      {filter[1]?.filterName}
                    </div>
                    <IconButton onClick={(e) => handleClick(e, filter[0])}>
                      <MoreVertIcon className="moreverticon" />
                    </IconButton>
                  </Box>
                </Box>

              ) 
            )}
            </div>
            </div>
          <Button
            onClick={() => handleOpenn()}
            variant="contained"
            ref={buttonRef}
            className="mui-button filter-button custom-button-add-view"
          >
            Add View
          </Button>
        </Box>
        {openn &&  !edit &&  (
         
         <FilterModal
           dbData={dbData}
           buttonRef={buttonRef}
           open={openn }
           edit={edit}
           setEdit={setEdit}
           setOpen={setOpenn}
           filterId={filterId}
           dbId={dbData?.db?._id}
           tableName={params?.tableName}
           setUnderLine={setUnderLine}
         />
      
       )}
   
        <div style={{ paddingLeft:'24px',display: 'flex', justifyContent: 'flex-start' }}>
          {/* <Button sx={{ fontSize: "11px" }} onClick={handleMenuOpen}>Hide Fields</Button> */}
          <Button sx={{ fontSize: `${variables.tablepagefontsize}`,paddingLeft:0,paddingRight:0 ,mr:2}} onClick={handleClickOpenManageField}>Manage Fields</Button>
                  
          <Button onClick={()=>setMinimap(!minimap)}>Minimap {!minimap?<CheckBoxOutlineBlankIcon fontSize="4px" />:<CheckBoxIcon fontSize="2px" />}</Button>
          {  params?.filterName && <> <Button sx={{ fontSize: `${variables.tablepagefontsize}`,paddingLeft:0,paddingRight:0,mr:2 }} onClick={handleEdit}>Edit filter</Button>
          <Button sx={{ fontSize: `${variables.tablepagefontsize}`,paddingLeft:0,paddingRight:0 ,mr:2}}  onClick={(e) => {
              handleClick(e, "share");
              shareLink();
            }

            
            }>share view</Button></>}

        </div>
        {openManageField && (
          <ManageFieldDropDown
            openManageField={openManageField}
            setOpenManageField={setOpenManageField}
          />
        )}
        {open && (
          <PopupModal
            title="Create Table"
            label="Table Name"
            open={open}
            setOpen={setOpen}
            submitData={saveTable}
            setVariable={setTable}
            joiMessage={"Table name"}
          />
        )}
      
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
        
        
          <MenuItem
            onClick={() => {
              deleteFilterInDb(currentTable);
              handleClose();
            }}
          >
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
            // deleteFilterInDb(currentTable);
            exportCSVTable();
            handleClose();
            }}
            >
            Export CSV
            </MenuItem>
        

        </Menu>
      </div>
      {openn&& edit && (<AddFilterPopup
        dbData={dbData}
        open={openn}
        edit={edit}
        setEdit={setEdit}
        setOpen={setOpenn}
        filterId={params?.filterName}
        dbId={dbData?.db?._id}
        tableName={params?.tableName}
        setUnderLine={setUnderLine}
      />)
      
      }
      {shareLinkOpen && (
            <ShareLinkPopUp
              title="Share Link"
              open={shareLinkOpen}
  
              setOpen={setShareLinkOpen}
              label="Link"
              textvalue={link}
            />
          )}
      <div  style={{ marginTop: "250px" }}>
        {isTableLoading ? (
          <CircularProgress className="table-loading" />
        ) : (
          <div>
            <MainTable setPage={setPage} page={page} minimap={minimap}/>
          </div>
        )}
      </div>
    </>
  );
}
TablesList.propTypes = {
  dbData: PropTypes.any,
  table: PropTypes.string,
  dbId: PropTypes.string,
  orgId: PropTypes.string,
  tables: PropTypes.any,
  dropdown: PropTypes.any,
  setSelectedTable: PropTypes.any,
  label: PropTypes.any,
  setTables: PropTypes.any,
};
